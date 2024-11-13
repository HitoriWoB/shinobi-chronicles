<?php

require_once __DIR__ . "/battle/Battle.php";
require_once __DIR__ . "/Route.php";

class Router {
    // TODO: Refactor this as 'page', there's currently a lot of refactoring to do to be possible
    const NAV_KEY = "page_name"; // Reserved key for links (e.g. https://url.com/?{NAV_KEY}={NAV_VALUE})
    const DEFAULT_PAGE = "profile";

    public function __construct(
        public readonly array $routes,
        public readonly string $base_url,
        public readonly string $logout_url,
        public ?string $current_route,
        public readonly array $ext_links = [
            'github' => 'https://github.com/elementum-games/shinobi-chronicles',
            'discord' => 'https://discord.gg/Kx52dbXEf3',
        ]
    ){}

    public function getApiLink(string $api_name): string {
        $api_string = "api/" . $api_name . ".php";

        // Check if requested api exists
        if(!file_exists(__DIR__ . "/../" . $api_string)) {
            throw new RuntimeExcepiont("Invalid API link requested ($api_name)!");
        }

        return $this->base_url . $api_string;
    }

    public function getPageLink(string $page_name, $url_params = []): string {
        // Check if route exists
        // Note: This is inteded for trouble shooting/dead link prevention
        if(!isset($this->routes[$page_name])) {
            throw new RuntimeException("Invalid page link requested ($page_name)!");
        }

        $url = $this->base_url . "?" . self::NAV_KEY . "=$page_name";

        // Set additional parameters
        if(!empty($url_params)) {
            foreach($url_params as $key => $val) {
                $url .= "&" . $key . "=" . $val;
            }
        }

        return $url;
    }

    public function setCurrentRoute(string $param_name, string $param_value): void {
        if(is_null($this->current_route)) {
            $this->current_route = $this->base_url . '?'. $param_name . "=" . $param_value;
        }
        else {
            $this->current_route .= "&" . $param_name . "=" . $param_value;
        }
    }

    public function assertRouteIsValid(Route $route, User $player) {
        $system = $player->system;

        // Dev only page
        if($route->dev_only && !$system->isDevEnvironment()) {
            throw new RuntimeExcepiont("Invalid page!");
        }

        // Check for battle if page is restricted
        if($route->battle_ok === false) {
            if($player->battle_id) {
                $contents_arr = [];
                foreach($_GET as $key => $val) {
                    $contents_arr[] = "GET[{$key}]=$val";
                }
                foreach($_POST as $key => $val) {
                    $contents_arr[] = "POST[{$key}]=$val";
                }
                $player->log(User::LOG_IN_BATTLE, implode(',', $contents_arr));
                throw new RuntimeException("You cannot visit this page while in battle!");
            }
        }

        // Check for spar/fight PvP type, stop page if trying to load spar/battle while in NPC battle
        if(isset($route->battle_type)) {
            $result = $system->db->query(
                "SELECT `battle_type` FROM `battles` WHERE `battle_id`='$player->battle_id' LIMIT 1"
            );
            if($system->db->last_num_rows > 0) {
                $battle_type = $system->db->fetch($result)['battle_type'];
                if($battle_type != $route->battle_type) {
                    throw new RuntimeException("You cannot visit this page while in combat!");
                }
            }
        }

        // Check if challenge locked
        if ($route->challenge_lock_ok === false) {
            if ($player->locked_challenge > 0) {
                throw new RuntimeException("You are unable to access this page while locked-in for battle!");
            }
        }

        // Non-generic page restrictions
        if(isset($route->user_check)) {
            if(!($route->user_check instanceof Closure)) {
                throw new RuntimeException("Invalid user check!");
            }

            $page_ok = $route->user_check->call($this, $player);

            if(!$page_ok) {
                throw new RuntimeException("");
            }
        }

        // Check location restrictions
        $player_location_type = TravelManager::getPlayerLocationType($system, $player);
        if ($player_location_type == TravelManager::LOCATION_TYPE_HOME_VILLAGE) {
            if (!$route->allowed_location_types[TravelManager::LOCATION_TYPE_HOME_VILLAGE]) {
                // Player is allowed in up to rank 3, then must go outside village
                // TODO: Update this to be class level
                if ($player->rank_num > 2) {
                    throw new RuntimeException("You cannot access this page while in a village!");
                }
            }
        }
        else if (!$route->allowed_location_types[$player_location_type]) {
            throw new RuntimeException("You can not access this page at your current location!");
        }

        if(isset($route->min_rank)) {
            if($player->rank_num < $route->min_rank) {
                throw new RuntimeException("You are not a high enough rank to access this page!");
            }
        }
    }

    public static function load(string $base_url): Router {
        // Note: Manage external ext_links in constructor, there shouldn't be many of these
        return new Router(
            routes: require __DIR__ . '/../config/routes.php',
            base_url: $base_url,
            logout_url: $base_url . "?logout=1",
            current_route: null
        );
    }
}