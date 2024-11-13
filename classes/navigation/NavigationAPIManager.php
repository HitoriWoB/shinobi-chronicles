<?php

require __DIR__ . '/NavigationLinkDto.php';

class NavigationAPIManager {
    public function __construct(
        public System $system,
        public array $routes,
        public ?User $player = null
    ){}

    /**
     * @return NavigationLinkDto[]
     */
    public function getUserMenu() : array {
        return $this->getMenuLinks(Route::MENU_USER);
    }

    /**
     * @return NavigationLinkDto[]
     */
    public function getActivityMenu(): array
    {
        return $this->getMenuLinks(Route::MENU_ACTIVITY);
    }

    /**
     * @return NavigationLinkDto[]
     */
    public function getVillageMenu(): array
    {
        return $this->getMenuLinks(Route::MENU_VILLAGE);
    }
    /**
     * @return NavigationLinkDto[]
     */
    public function getStaffMenu(): array
    {
        $return_arr = [];

        if ($this->player->isModerator() || $this->player->hasAdminPanel() || $this->player->isSupportStaff()) {
            if ($this->player->isSupportStaff()) {
                $return_arr[] = new NavigationLinkDto(
                    title: "Support Panel",
                    url: $this->system->router->getPageLink('manage_support'),
                    active: true,
                    id: "manage_support",
                );
            }
            if ($this->player->isModerator()) {
                $return_arr[] = new NavigationLinkDto(
                    title: "Mod Panel",
                    url: $this->system->router->getPageLink('mod_panel'),
                    active: true,
                    id: "mod_panel",
                );
            }
            if ($this->player->hasAdminPanel()) {
                $return_arr[] = new NavigationLinkDto(
                    title: "Admin Panel",
                    url: $this->system->router->getPageLink('admin_panel'),
                    active: true,
                    id: "admin_panel",
                );
            }
        }

        return $return_arr;
    }

    public function getMenuLinks(string $menu_name): array {
        $return_arr = array();

        // Update condition pages
        if(!is_null($this->player)) {
            if ($this->player->clan) {
                $this->routes['clan']->menu = Route::MENU_VILLAGE;
            }
            if ($this->player->rank_num >= 3) {
                $this->routes['team']->menu = Route::MENU_USER;
            }
        }

        // Filter menu
        foreach($this->routes as $page_name => $route) {
            if(!isset($page->menu) || $page->menu != $menu_name || ($page->dev_only && !$this->system->isDevEnvironment())) {
                continue;
            }
            $return_arr[] = new NavigationLinkDto(
                title: $page->title,
                url: $this->system->router->getPageLink($page_name),
                active: true,
                id: $page_name
            );
        }

        return $return_arr;
    }

    /**
     * @return NavigationLinkDto[]
     */
    public static function getHeaderMenu(System $system): array
    {
        return [
            new NavigationLinkDto(
                title: "HOME",
                url: $system->router->getPageLink('home'),
                active: true,
                id: 0,
            ),
            new NavigationLinkDto(
                title: "NEWS",
                url: $system->router->getPageLink('news'),
                active: true,
                id: 0,
            ),
            new NavigationLinkDto(
                title: "DISCORD",
                url: $system->router->ext_links['discord'],
                active: true,
                id: 0,
            ),
            new NavigationLinkDto(
                title: "MANUAL",
                url: $system->router->base_url . "manual.php",
                active: true,
                id: 0,
            ),
            new NavigationLinkDto(
                title: "GITHUB",
                url: $system->router->ext_links['github'],
                active: true,
                id: 0,
            ),
            new NavigationLinkDto(
                title: "RULES",
                url: $system->router->base_url . "rules.php",
                active: true,
                id: 0,
            ),
            new NavigationLinkDto(
                title: "SUPPORT",
                url: $system->router->base_url . "support.php",
                active: true,
                id: 0,
            ),

        ];
    }

    /**
     * @param System $system
     * @param User|null $player
     * @return NavigationAPIManager
     */
    public static function loadNavigationAPIManager(System $system, ?User $player = null): NavigationAPIManager {
        return new NavigationAPIManager(
            system: $system,
            routes: $system->router->routes,
            player: $player
        );
    }

}