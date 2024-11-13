<?php
// Begin session & page load time
session_start();
$PAGE_LOAD_START = microtime(as_float: true);

// Load classes & initilize system
require_once("classes/_autoload.php");
$system = System::initialize();

// Display errors on dev environments
if(Auth::displayErrors(system: $system)) {
    ini_set(option: 'display_errors', value: 'On');
}

// Check for logout
if(isset($_GET['logout']) && $_GET['logout'] == 1) {
    Auth::processLogout(system: $system);
}

// Logged out
if(!isset($_SESSION['userid'])) {
    $route = $system->router->routes['home'];
    $system->layout->renderBeforeContentHTML(
        system: $system,
        player: null, // No session started
        page_title: $route->title,

        render_header: $route->render_header, render_sidebar: $route->render_sidebar,
        render_topbar: $route->render_topbar, render_content: $route->render_content
    );

    require(__DIR__ . '/pages/' . $route->file_name);
    ($route->function_name)();
}
// Logged in
else {
    $system->db->startTransaction();
    $player = User::loadFromId(
        system: $system,
        user_id: $_SESSION['user_id']
    );

    // Check for forced logout
    if($player->last_login < time() - (System::LOGOUT_LIMIT * 60)) {
        Auth::processLogout(system: $system);
        exit;
    }

    // Load player & close session as user is loaded
    $player->loadData();
    session_write_close();

    // Set layout
    $system->setLayoutByName($player->layout);

    // Game closure/maintenance
    if(!$system->SC_OPEN && !StaffManager::hasServerMaintAccess(staff_level: $player->staff_level)) {
        $route = $system->router->routes['home'];

        // User system layout here as
        $system->layout->renderBeforeContentHTML(
            system: $system,
            player: $player ?? null,
            page_title: $route->title,

            render_header: $route->render_header, render_sidebar: $route->render_sidebar,
            render_topbar: $route->render_topbar, render_content: $route->render_content
        );

        require(__DIR__ . '/pages/' . $route->file_name);
        ($route->function())();
    }
    // User ban
    elseif($player->checkBan(StaffManager::BAN_TYPE_GAME)) {
        $route = $system->router->routes['account_record'];
        $ban_type = StaffManager::BAN_TYPE_GAME;
        $expire_int = $player->ban_data[$ban_type];
        $ban_expire = ($expire_int == StaffManager::PERM_BAN_VALUE ? $expire_int : $system->time_remaining($player->ban_data[StaffManager::BAN_TYPE_GAME] - time()));

        $system->renderBeforeContentHTML(
            system: $system,
            player: $player,
            page_title: "",

            render_header: $route->render_header, render_sidebar: $route->render_sidebar,
            render_topbar: $route->render_topbar, render_content: $route->render_content
        );

        // Display ban info
        require 'templates/ban_info.php';

        // Load user record
        require (__DIR__ . '/pages/' . $route->file_name);
        ($route->function_name())();
    }
    // IP ban
    else if(Auth::checkForIPBan(system: $system, ip: $_SERVER['REMOTE_ADDR'])) {
        $route = $system->router->routes['profile'];
        
        // Do not render content/bars for ip ban
        $route->render_topbar = false;
        $route->render_content = false;
        $route->render_header = false;
        $route->render_sidebar = false;

        // Set ban data for display
        $ban_type = StaffManager::BAN_TYPE_IP;
        $expire_int = -1;
        $ban_expire = ($expire_int == StaffManager::PERM_BAN_VALUE ? $expire_int : $system->time_remaining($player->ban_data[StaffManager::BAN_TYPE_GAME] - time()));

        $system->layout->renderBeforeContentHTML(
            system: $system,
            player: $player,
            page_title: "",

            render_header: $route->render_header, render_sidebar: $route->render_sidebar,
            render_topbar: $route->render_topbar, render_content: $route->render_content
        );

        //Ban info
        require 'templates/ban_info.php';
    }
    else {
        // Clear global message
        if(!$player->global_message_viewed && isset($_GET['clear_message'])) {
            $player->global_message_viewed = true;
        }

        // Log actions
        if($player->log_actions) {
            $log_contents = '';
            if($_GET['id'] && isset($routes[$_GET['id']])) {
                $log_contents .= 'Page: ' . $routes[$_GET['id']]['title'] . ' - Time: ' . round(microtime(true), 1) . '[br]';
            }
            foreach($_GET as $key => $value) {
                $val = $value;
                if($key == 'id') {
                    continue;
                }
                if(strlen($val) > 32) {
                    $val = substr($val, 0, 32) . '...';
                }
                $log_contents .= $key . ': ' . $val . '[br]';
            }
            foreach($_POST as $key => $value) {
                $val = $value;
                if(strpos($key, 'password') !== false) {
                    $val = '*******';
                }
                if(strlen($val) > 32) {
                    $val = substr($val, 0, 32) . '...';
                }
                $log_contents .= $key . ': ' . $val . '[br]';
            }
            $system->log('player_action', $player->user_name, $log_contents);
        }

        $page = isset($_GET[Router::NAV_KEY]) ? $system->db->clean($_GET[Router::NAV_KEY]) : Router::DEFAULT_PAGE;
        $route = $system->router->routes[$page] ?? null;

        try {
           // Load page title
           if($system->layout->usesV2Interface()) {
                $location_name = $player->current_location->location_id
                    ? ' ' . ' <div id="contentHeaderLocation">' . " | " . $player->current_location->name . '</div>'
                    : null;
                $location_coords = "<div id='contentHeaderCoords'>" . " | " . $player->region->name . " (" . $player->location->x . "." . $player->location->y . ")" . '</div>';
                $content_header_divider = '<div class="contentHeaderDivider"><svg width="100%" height="2"><line x1="0%" y1="1" x2="100%" y2="1" stroke="#77694e" stroke-width="1"></line></svg></div>';
            }
            else {
                $location_name = $player->current_location->location_id
                    ? ' ' . ' <div id="contentHeaderLocation">' . $player->current_location->name . '</div>'
                    : null;
                $location_coords = null;
                $content_header_divider = null;
            }
            $page_title = $route->title . $location_name . $location_coords . $content_header_divider;

            // Force battle view if waiting too long
            if($player->battle_id && empty($route->battle_type)) {
                $battle_result = $system->db->query(
                    "SELECT winner, turn_time, battle_type FROM battles WHERE `battle_id`='{$player->battle_id}' LIMIT 1"
                );
                if($system->db->last_num_rows) {
                    $battle_data = $system->db->fetch($battle_result);
                    $time_since_turn = time() - $battle_data['turn_time'];

                    if($battle_data['winner'] && $time_since_turn >= 60) {
                        foreach(Router::$routes as $page_id => $page) {
                            $type = $page->battle_type ?? null;
                            if($type == $battle_data['battle_type']) {
                                $id = $page_id;
                                $route = Router::$routes[$id];
                            }
                        }
                    }
                }
            }

            // Check for valid route & permissions
            try {
                $system->router->assertRouteIsValid(route: $route, player: $player);
            } catch(RuntimeException $e) {
                // Display blank page with error only
                $system->message($e->getMessage());
                $system->layout->renderBeforeContentHTML(
                    system: $system,
                    player: $player ?? null,
                    page_title: ''
                );
                $system->printMessage(force_display: true);
                $system->layout->renderAfterContentHTML(
                    system: $system,
                    player: $player ?? null,
                    page_load_time: (microtime(as_float: true) - $PAGE_LOAD_START),
                    render_hotbar: $system->isDevEnvironment()
                );
                exit; // IMPORTANT: Exit here, unauthorized pages shouldn't commit transactions
            }

            // Set current route
            $system->router->setCurrentRoute(param_name: Router::NAV_KEY, param_value: $page);

            // Render page
            $system->layout->renderBeforeContentHTML(
                system: $system,
                player: $player,
                page_title: $page_title, // Custom page title set above, don't use Route
    
                render_header: $route->render_header, render_sidebar: $route->render_sidebar,
                render_topbar: $route->render_topbar, render_content: $route->render_content
            );

            // Legacy event notification
            if(!$system->layout->usesV2Interface() && !is_null($system->event)) {
                require_once ('templates/temp_event_header.php');
            }

            require(__DIR__ . '/pages/' . $route->file_name);
            try {
                ($route->function)();   
            } catch(DatabaseDeadlockException $e) {
                // Wait random time between 100-500ms, then retry deadlocked transaction
                $system->db->rollbackTransaction();
                usleep(mt_rand(100000, 500000));

                $system->db->startTransaction();
                $player->loadData();
                ($route->function_name)();
            }
        } catch (Exception $e) {
            if($e instanceof DatabaseDeadlockException) {
                error_log("DEADLOCK - retry did not solve");
                $system->db->rollbackTransaction();
                $system->message("Database deadlock, please reload your page and tell Lsm to fix!");
                $system->printMessage(true);
            }
            elseif(strlen($e->getMessage()) > 1) {
                $system->db->rollbackTransaction();
                $system->message($e->getMessage());
                $system->printMessage(true);
            }
        }

        $player->updateData();
    }
}


$system->layout->renderAfterContentHTML(
    system: $system,
    player: $player ?? null,
    page_load_time: (microtime(as_float: true) - $PAGE_LOAD_START),

    render_content: $route->render_content,
    render_hotbar: ($system->isDevEnvironment())
);
$system->db->commitTransaction();