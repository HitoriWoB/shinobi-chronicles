<?php

require_once __DIR__ . '/../classes/Route.php';
require_once __DIR__ . '/../classes/travel/TravelManager.php';
require_once __DIR__ . '/../classes/battle/Battle.php';

return $routes = [
    // Home page
    'home' => Route::load(
        file_name: 'home.php',
        title: 'Home',
        function_name: 'home',
        menu: Route::MENU_NONE,

        // Content, header and bars disabled for home page
        render_header: false,
        render_sidebar: false,
        render_topbar: false,
        render_content: false,
    ),
    // User Menu
    'profile' => Route::load(
        file_name: 'profile.php',
        title: 'Profile',
        function_name: 'userProfile',
        menu: Route::MENU_USER,
    ),
    'inbox' => Route::load(
        file_name: 'inbox.php',
        title: 'Inbox',
        function_name: 'inbox',
        menu: Route::MENU_USER,
    ),
    'jutsu' => Route::load(
        file_name: 'jutsu.php',
        title: 'Jutsu',
        function_name: 'jutsu',
        menu: Route::MENU_USER,
        battle_ok: true,
    ),
    'gear' => Route::load(
        file_name: 'gear.php',
        title: 'Gear',
        function_name: 'gear',
        menu: Route::MENU_USER,
        battle_ok: false,
    ),
    'bloodline' => Route::load(
        file_name: 'bloodline.php',
        title: 'Bloodline',
        function_name: 'bloodline',
        menu: 'conditional',
        battle_ok: false,
    ),
    'members' => Route::load(
        file_name: 'members.php',
        title: 'Members',
        function_name: 'members',
        menu: Route::MENU_USER,
    ),
    'send_money' => Route::load(
        file_name: 'sendMoney.php',
        title: 'Send Money',
        function_name: 'sendMoney',
        menu: Route::MENU_NONE,
    ),
    'team' => Route::load(
        file_name: 'team.php',
        title: 'Team',
        function_name: 'team',
        menu: 'conditional',
        min_rank: 3,
    ),
    'marriage' => Route::load(
        file_name: 'marriage.php',
        title: 'Marriage',
        function_name: 'marriage',
        menu: Route::MENU_USER,
    ),

    // Activity Menu
    'chat' => Route::load(
        file_name: 'chat.php',
        title: 'Chat',
        function_name: 'chat',
        menu: Route::MENU_ACTIVITY,
    ),
    'travel' => Route::load(
        file_name: 'travel.php',
        title: 'Travel',
        function_name: 'travel',
        menu: Route::MENU_ACTIVITY,
        battle_ok: false,
        survival_mission_ok: false,
        challenge_lock_ok: false,
    ),
    'arena' => Route::load(
        file_name: 'arena.php',
        title: 'Arena',
        function_name: 'arena',
        menu: Route::MENU_ACTIVITY,
        battle_type: Battle::TYPE_AI_ARENA,
        allowed_location_types: [TravelManager::LOCATION_TYPE_DEFAULT],
        challenge_lock_ok: false,
    ),
    'training' => Route::load(
        file_name: 'training.php',
        title: 'Training',
        function_name: 'training',
        menu: Route::MENU_ACTIVITY,
        battle_ok: false,
        allowed_location_types: [TravelManager::LOCATION_TYPE_DEFAULT],
    ),
    'mission' => Route::load(
        file_name: 'missions.php',
        title: 'Missions',
        function_name: 'missions',
        menu: Route::MENU_ACTIVITY,
        battle_type: Battle::TYPE_AI_MISSION,
        min_rank: 2,
        challenge_lock_ok: false,
    ),
    'special_mission' => Route::load(
        file_name: 'special_missions.php',
        title: 'Special Missions',
        function_name: 'specialMissions',
        menu: Route::MENU_ACTIVITY,
        min_rank: 2,
        battle_ok: false,
        challenge_lock_ok: false,
    ),
    'spar' => Route::load(
        file_name: 'spar.php',
        title: 'Spar',
        function_name: 'spar',
        menu: Route::MENU_ACTIVITY,
        battle_type: Battle::TYPE_SPAR,
        challenge_lock_ok: false,
    ),
    'ramen_shop' => Route::load(
        file_name: 'healingShop.php',
        title: 'Ramen Shop',
        function_name: 'healingShop',
        menu: Route::MENU_ACTIVITY,
        battle_ok: false,
        allowed_location_types: [TravelManager::LOCATION_TYPE_HOME_VILLAGE, TravelManager::LOCATION_TYPE_COLOSSEUM],
    ),
    'view_battles' => Route::load(
        file_name: 'viewBattles.php',
        title: 'View Battles',
        function_name: 'viewBattles',
        menu: Route::MENU_ACTIVITY,
        battle_ok: true,
    ),

    // Village Menu
    'shop' => Route::load(
        file_name: 'store.php',
        title: 'Shop',
        function_name: 'store',
        menu: Route::MENU_VILLAGE,
        allowed_location_types: [TravelManager::LOCATION_TYPE_HOME_VILLAGE],
    ),
    'village_hq' => Route::load(
        file_name: 'villageHQ_v2.php',
        title: 'Village HQ',
        function_name: 'villageHQ',
        menu: Route::MENU_VILLAGE,
        battle_ok: false,
    ),
    'clan' => Route::load(
        file_name: 'clan.php',
        title: 'Clan',
        function_name: 'clan',
        menu: 'conditional',
    ),
    'premium' => Route::load(
        file_name: 'premium_shop.php',
        title: 'Ancient Market',
        function_name: 'premiumShop',
        menu: Route::MENU_VILLAGE,
        challenge_lock_ok: false,
    ),
    'academy' => Route::load(
        file_name: 'academy.php',
        title: 'Academy',
        function_name: 'academy',
        menu: Route::MENU_VILLAGE,
    ),

    // Staff menu
    'support_panel' => Route::load(
        file_name: 'supportPanel.php',
        title: 'Support Panel',
        function_name: 'supportPanel',
        menu: Route::MENU_CONDITIONAL,
        user_check: function(User $u) {
            return $u->isSupportStaff();
        }
    ),
    'mod_panel' => Route::load(
        file_name: 'modPanel.php',
        title: 'Mod Panel',
        function_name: 'modPanel',
        menu: Route::MENU_CONDITIONAL,
        user_check: function(User $u) {
            return $u->isModerator();
        }
    ),
    'admin_panel' => Route::load(
        file_name: 'adminPanel.php',
        title: 'Admin Panel',
        function_name: 'adminPanel',
        menu: Route::MENU_CONDITIONAL,
        user_check: function(User $u) {
            return $u->hasAdminPanel();
        }
    ),
    'chat_log' => Route::load(
        file_name: 'chat_log.php',
        title: 'Chat Log',
        function_name: 'chatLog',
        menu: Route::MENU_CONDITIONAL,
        user_check: function(User $u) {
            return $u->isModerator();
        }
    ),

    // Misc
    'settings' => Route::load(
        file_name: 'settings.php',
        title: 'Settings',
        function_name: 'userSettings',
        menu: Route::MENU_USER,
    ),
    'report' => Route::load(
        file_name: 'report.php',
        title: 'Report',
        function_name: 'report',
        menu: Route::MENU_CONDITIONAL,
    ),
    'battle' => Route::load(
        file_name: 'battle.php',
        title: 'Battle',
        function_name: 'battle',
        menu: Route::MENU_NONE,
        battle_type: Battle::TYPE_FIGHT,
    ),
    'level_up' => Route::load(
        file_name: 'levelUp.php',
        title: 'Rank Exam',
        function_name: 'rankUp',
        menu: Route::MENU_NONE,
        battle_type: Battle::TYPE_AI_RANKUP,
    ),
    'event' => Route::load(
        file_name: 'event.php',
        title: 'Event',
        function_name: 'event',
        menu: Route::MENU_NONE,
    ),
    'news' => Route::load(
        file_name: 'news.php',
        title: 'News',
        function_name: 'news',
        menu: Route::MENU_NONE,
    ),
    'account_record' => Route::load(
        file_name: 'accountRecord.php',
        title: 'Account Record',
        function_name: 'accountRecord',
        menu: Route::MENU_NONE,
    ),
    'forbidden_shop' => Route::load(
        file_name: 'forbiddenShop.php',
        title: "???",
        function_name: 'forbiddenShop',
        menu: Route::MENU_NONE,
    ),
    'war' => Route::load(
        file_name: 'war.php',
        title: "War",
        function_name: 'war',
        menu: Route::MENU_NONE,
        battle_type: Battle::TYPE_AI_WAR,
    ),
    'challenge' => Route::load(
        file_name: 'challenge.php',
        title: "Challenge",
        function_name: 'challenge',
        menu: Route::MENU_NONE,
        battle_type: Battle::TYPE_CHALLENGE,
    ),
];