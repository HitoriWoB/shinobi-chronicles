<?php
class Route {
    const LOCATION_ACCESS_INCLUSIVE = true; // only given locations are allowed, default
    const LOCATION_ACCESS_EXCLUSIVE = false; // all but given locations are allowed

    // Default access to locations (default is typically true)
    const DEFAULT_LOCATION_TYPES = [
        TravelManager::LOCATION_TYPE_DEFAULT => true,
        TravelManager::LOCATION_TYPE_HOME_VILLAGE => true,
        TravelManager::LOCATION_TYPE_ALLY_VILLAGE => true,
        TravelManager::LOCATION_TYPE_ENEMY_VILLAGE => true,
        TravelManager::LOCATION_TYPE_ABYSS => true,
        TravelManager::LOCATION_TYPE_COLOSSEUM => true,
        TravelManager::LOCATION_TYPE_TOWN => true,
        TravelManager::LOCATION_TYPE_CASTLE => true,
    ];

    const MENU_USER = 'user';
    const MENU_ACTIVITY = 'activity';
    const MENU_VILLAGE = 'village';
    const MENU_CONDITIONAL = 'conditional';
    const MENU_NONE = 'none';

    public function __construct(
        public string $file_name,
        public string $title,
        public string $function_name,
        public string $menu,

        public ?int $battle_type = null,
        public ?int $min_rank = null,

        public bool $battle_ok = true,
        public bool $survival_mission_ok = true,
        public bool $challenge_lock_ok = true,

        public ?Closure $user_check = null,
        public bool $dev_only = false,

        public array $allowed_location_types = self::DEFAULT_LOCATION_TYPES,
        public bool $location_access_mode = self::LOCATION_ACCESS_INCLUSIVE,

        public bool $render_header = true,
        public bool $render_sidebar = true,
        public bool $render_topbar = true,
        public bool $render_content = true,
    ){}

    public static function load(
        string $file_name, string $title, string $function_name, string $menu,
        ?int $battle_type = null, ?int $min_rank = null,
        bool $battle_ok = true, bool $survival_mission_ok = true, bool $challenge_lock_ok = true,
        ?Closure $user_check = null, bool $dev_only = false,
        ?array $allowed_location_types = [], bool $location_access_mode = self::LOCATION_ACCESS_INCLUSIVE,
        bool $render_header = true, bool $render_sidebar = true, bool $render_topbar = true, bool $render_content = true
    ): Route {
        $route = new Route(
            file_name: $file_name,
            title: $title,
            function_name: $function_name,
            menu: $menu,

            battle_type: $battle_type,
            min_rank: $min_rank,
            battle_ok: $battle_ok,
            survival_mission_ok: $survival_mission_ok,
            challenge_lock_ok: $challenge_lock_ok,
            user_check: $user_check,
            dev_only: $dev_only,

            allowed_location_types: Route::DEFAULT_LOCATION_TYPES,
            location_access_mode: $location_access_mode,

            render_header: $render_header,
            render_sidebar: $render_sidebar,
            render_topbar: $render_topbar,
            render_content: $render_content
        );

        // Update location access, by default all location types are allowed
        if(count($allowed_location_types) > 0) {
            // Inclusive access, only provided are allowed
            if($location_access_mode == Route::LOCATION_ACCESS_INCLUSIVE) {
                // All location types restriced by default
                $route->allowed_location_types = array_fill_keys($route->allowed_location_types, false);

                // Allow appropriate location types
                foreach($allowed_location_types as $location) {
                    $route->allowed_location_types[$location] = true;
                }
            }
            // Exclusive access, all but provided are allowed
            else {
                // Restrict provided location types
                foreach($allowed_location_types as $location) {
                    $route->allowed_location_types[$location] = false;
                }
            }
        }

        return $route;
    }
}