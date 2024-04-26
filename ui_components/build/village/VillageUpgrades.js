import { apiFetch } from "../utils/network.js";
import { useModal } from '../utils/modalContext.js';
export function VillageUpgrades({
  playerSeatState,
  villageAPI,
  buildingUpgradeDataState,
  setBuildingUpgradeDataState,
  resourceDataState,
  setProposalDataState
}) {
  const [selectedBuilding, setSelectedBuilding] = React.useState(null);
  const {
    openModal
  } = useModal();
  const currentMaterials = resourceDataState.find(resource => resource.resource_name === "materials").count;
  const currentFood = resourceDataState.find(resource => resource.resource_name === "food").count;
  const currentWealth = resourceDataState.find(resource => resource.resource_name === "wealth").count;
  const BeginConstruction = () => {
    apiFetch(villageAPI, {
      request: 'CreateProposal',
      type: 'begin_construction',
      building_key: selectedBuilding.key
    }).then(response => {
      if (response.errors.length) {
        handleErrors(response.errors);
        return;
      }
      setProposalDataState(response.data.proposalData);
      openModal({
        header: 'Confirmation',
        text: response.data.response_message,
        ContentComponent: null,
        onConfirm: null
      });
    });
  };
  const CancelConstruction = () => {
    apiFetch(villageAPI, {
      request: 'CreateProposal',
      type: 'cancel_construction',
      building_key: selectedBuilding.key
    }).then(response => {
      if (response.errors.length) {
        handleErrors(response.errors);
        return;
      }
      setProposalDataState(response.data.proposalData);
      openModal({
        header: 'Confirmation',
        text: response.data.response_message,
        ContentComponent: null,
        onConfirm: null
      });
    });
  };
  const CheckBoostConstruction = () => {
    apiFetch(villageAPI, {
      request: 'GetConstructionBoostCost',
      building_key: selectedBuilding.key
    }).then(response => {
      if (response.errors.length) {
        handleErrors(response.errors);
        return;
      }
      openModal({
        header: 'Confirmation',
        text: "Boosting the construction of this building will cost " + response.data.response_message + " Village Points",
        ContentComponent: null,
        onConfirm: () => BoostConstruction()
      });
    });
  };
  const BoostConstruction = () => {
    apiFetch(villageAPI, {
      request: 'CreateProposal',
      type: 'boost_construction',
      building_key: selectedBuilding.key
    }).then(response => {
      if (response.errors.length) {
        handleErrors(response.errors);
        return;
      }
      setProposalDataState(response.data.proposalData);
      openModal({
        header: 'Confirmation',
        text: response.data.response_message,
        ContentComponent: null,
        onConfirm: null
      });
    });
  };
  const buildingClickHandler = building => {
    setSelectedBuilding(building);
  };
  const renderBuildingDetails = () => {
    const upkeep = getBuildingUpkeep(selectedBuilding);
    const construction_progress_percent = selectedBuilding.construction_progress / selectedBuilding.construction_progress_required * 100;
    const renderHealthBar = () => {
      const percentage = selectedBuilding.health / selectedBuilding.max_health * 100;
      let barColor;
      let strokeColor = '#2b2c2c';
      if (percentage > 50) {
        barColor = '#00b044';
      } else if (percentage > 25) {
        barColor = 'yellow';
      } else {
        barColor = 'red';
      }
      return /*#__PURE__*/React.createElement("div", {
        className: "building_health_bar"
      }, /*#__PURE__*/React.createElement("svg", {
        width: "325",
        height: "9"
      }, /*#__PURE__*/React.createElement("g", {
        transform: "skewX(-25)"
      }, /*#__PURE__*/React.createElement("rect", {
        x: "5",
        y: "0",
        width: "50",
        height: "5",
        style: {
          fill: strokeColor,
          stroke: strokeColor,
          strokeWidth: '0'
        }
      })), /*#__PURE__*/React.createElement("g", {
        transform: "skewX(-25)"
      }, /*#__PURE__*/React.createElement("rect", {
        x: "5",
        y: "0",
        width: percentage * 3.2,
        height: "5",
        style: {
          fill: barColor,
          stroke: strokeColor,
          strokeWidth: '0'
        }
      })), /*#__PURE__*/React.createElement("g", {
        transform: "skewX(-25)"
      }, /*#__PURE__*/React.createElement("rect", {
        x: "5",
        y: "0",
        rx: "2",
        ry: "2",
        width: "10",
        height: "5",
        style: {
          fill: 'transparent',
          stroke: strokeColor,
          strokeWidth: '2'
        }
      }), /*#__PURE__*/React.createElement("rect", {
        x: "15",
        y: "0",
        rx: "2",
        ry: "2",
        width: "10",
        height: "5",
        style: {
          fill: 'transparent',
          stroke: strokeColor,
          strokeWidth: '2'
        }
      }), /*#__PURE__*/React.createElement("rect", {
        x: "25",
        y: "0",
        rx: "2",
        ry: "2",
        width: "10",
        height: "5",
        style: {
          fill: 'transparent',
          stroke: strokeColor,
          strokeWidth: '2'
        }
      }), /*#__PURE__*/React.createElement("rect", {
        x: "35",
        y: "0",
        rx: "2",
        ry: "2",
        width: "10",
        height: "5",
        style: {
          fill: 'transparent',
          stroke: strokeColor,
          strokeWidth: '2'
        }
      }), /*#__PURE__*/React.createElement("rect", {
        x: "45",
        y: "0",
        rx: "2",
        ry: "2",
        width: "10",
        height: "5",
        style: {
          fill: 'transparent',
          stroke: strokeColor,
          strokeWidth: '2'
        }
      }), /*#__PURE__*/React.createElement("rect", {
        x: "55",
        y: "0",
        rx: "2",
        ry: "2",
        width: "10",
        height: "5",
        style: {
          fill: 'transparent',
          stroke: strokeColor,
          strokeWidth: '2'
        }
      }), /*#__PURE__*/React.createElement("rect", {
        x: "65",
        y: "0",
        rx: "2",
        ry: "2",
        width: "10",
        height: "5",
        style: {
          fill: 'transparent',
          stroke: strokeColor,
          strokeWidth: '2'
        }
      }), /*#__PURE__*/React.createElement("rect", {
        x: "75",
        y: "0",
        rx: "2",
        ry: "2",
        width: "10",
        height: "5",
        style: {
          fill: 'transparent',
          stroke: strokeColor,
          strokeWidth: '2'
        }
      }), /*#__PURE__*/React.createElement("rect", {
        x: "85",
        y: "0",
        rx: "2",
        ry: "2",
        width: "10",
        height: "5",
        style: {
          fill: 'transparent',
          stroke: strokeColor,
          strokeWidth: '2'
        }
      }), /*#__PURE__*/React.createElement("rect", {
        x: "95",
        y: "0",
        rx: "2",
        ry: "2",
        width: "10",
        height: "5",
        style: {
          fill: 'transparent',
          stroke: strokeColor,
          strokeWidth: '2'
        }
      }), /*#__PURE__*/React.createElement("rect", {
        x: "105",
        y: "0",
        rx: "2",
        ry: "2",
        width: "10",
        height: "5",
        style: {
          fill: 'transparent',
          stroke: strokeColor,
          strokeWidth: '2'
        }
      }), /*#__PURE__*/React.createElement("rect", {
        x: "115",
        y: "0",
        rx: "2",
        ry: "2",
        width: "10",
        height: "5",
        style: {
          fill: 'transparent',
          stroke: strokeColor,
          strokeWidth: '2'
        }
      }), /*#__PURE__*/React.createElement("rect", {
        x: "125",
        y: "0",
        rx: "2",
        ry: "2",
        width: "10",
        height: "5",
        style: {
          fill: 'transparent',
          stroke: strokeColor,
          strokeWidth: '2'
        }
      }), /*#__PURE__*/React.createElement("rect", {
        x: "135",
        y: "0",
        rx: "2",
        ry: "2",
        width: "10",
        height: "5",
        style: {
          fill: 'transparent',
          stroke: strokeColor,
          strokeWidth: '2'
        }
      }), /*#__PURE__*/React.createElement("rect", {
        x: "145",
        y: "0",
        rx: "2",
        ry: "2",
        width: "10",
        height: "5",
        style: {
          fill: 'transparent',
          stroke: strokeColor,
          strokeWidth: '2'
        }
      }), /*#__PURE__*/React.createElement("rect", {
        x: "155",
        y: "0",
        rx: "2",
        ry: "2",
        width: "10",
        height: "5",
        style: {
          fill: 'transparent',
          stroke: strokeColor,
          strokeWidth: '2'
        }
      }), /*#__PURE__*/React.createElement("rect", {
        x: "165",
        y: "0",
        rx: "2",
        ry: "2",
        width: "10",
        height: "5",
        style: {
          fill: 'transparent',
          stroke: strokeColor,
          strokeWidth: '2'
        }
      }), /*#__PURE__*/React.createElement("rect", {
        x: "175",
        y: "0",
        rx: "2",
        ry: "2",
        width: "10",
        height: "5",
        style: {
          fill: 'transparent',
          stroke: strokeColor,
          strokeWidth: '2'
        }
      }), /*#__PURE__*/React.createElement("rect", {
        x: "185",
        y: "0",
        rx: "2",
        ry: "2",
        width: "10",
        height: "5",
        style: {
          fill: 'transparent',
          stroke: strokeColor,
          strokeWidth: '2'
        }
      }), /*#__PURE__*/React.createElement("rect", {
        x: "195",
        y: "0",
        rx: "2",
        ry: "2",
        width: "10",
        height: "5",
        style: {
          fill: 'transparent',
          stroke: strokeColor,
          strokeWidth: '2'
        }
      }), /*#__PURE__*/React.createElement("rect", {
        x: "205",
        y: "0",
        rx: "2",
        ry: "2",
        width: "10",
        height: "5",
        style: {
          fill: 'transparent',
          stroke: strokeColor,
          strokeWidth: '2'
        }
      }), /*#__PURE__*/React.createElement("rect", {
        x: "215",
        y: "0",
        rx: "2",
        ry: "2",
        width: "10",
        height: "5",
        style: {
          fill: 'transparent',
          stroke: strokeColor,
          strokeWidth: '2'
        }
      }), /*#__PURE__*/React.createElement("rect", {
        x: "225",
        y: "0",
        rx: "2",
        ry: "2",
        width: "10",
        height: "5",
        style: {
          fill: 'transparent',
          stroke: strokeColor,
          strokeWidth: '2'
        }
      }), /*#__PURE__*/React.createElement("rect", {
        x: "235",
        y: "0",
        rx: "2",
        ry: "2",
        width: "10",
        height: "5",
        style: {
          fill: 'transparent',
          stroke: strokeColor,
          strokeWidth: '2'
        }
      }), /*#__PURE__*/React.createElement("rect", {
        x: "245",
        y: "0",
        rx: "2",
        ry: "2",
        width: "10",
        height: "5",
        style: {
          fill: 'transparent',
          stroke: strokeColor,
          strokeWidth: '2'
        }
      }), /*#__PURE__*/React.createElement("rect", {
        x: "255",
        y: "0",
        rx: "2",
        ry: "2",
        width: "10",
        height: "5",
        style: {
          fill: 'transparent',
          stroke: strokeColor,
          strokeWidth: '2'
        }
      }), /*#__PURE__*/React.createElement("rect", {
        x: "265",
        y: "0",
        rx: "2",
        ry: "2",
        width: "10",
        height: "5",
        style: {
          fill: 'transparent',
          stroke: strokeColor,
          strokeWidth: '2'
        }
      }), /*#__PURE__*/React.createElement("rect", {
        x: "275",
        y: "0",
        rx: "2",
        ry: "2",
        width: "10",
        height: "5",
        style: {
          fill: 'transparent',
          stroke: strokeColor,
          strokeWidth: '2'
        }
      }), /*#__PURE__*/React.createElement("rect", {
        x: "285",
        y: "0",
        rx: "2",
        ry: "2",
        width: "10",
        height: "5",
        style: {
          fill: 'transparent',
          stroke: strokeColor,
          strokeWidth: '2'
        }
      }), /*#__PURE__*/React.createElement("rect", {
        x: "295",
        y: "0",
        rx: "2",
        ry: "2",
        width: "10",
        height: "5",
        style: {
          fill: 'transparent',
          stroke: strokeColor,
          strokeWidth: '2'
        }
      }), /*#__PURE__*/React.createElement("rect", {
        x: "305",
        y: "0",
        rx: "2",
        ry: "2",
        width: "10",
        height: "5",
        style: {
          fill: 'transparent',
          stroke: strokeColor,
          strokeWidth: '2'
        }
      }), /*#__PURE__*/React.createElement("rect", {
        x: "315",
        y: "0",
        rx: "2",
        ry: "2",
        width: "10",
        height: "5",
        style: {
          fill: 'transparent',
          stroke: strokeColor,
          strokeWidth: '2'
        }
      }))));
    };
    return /*#__PURE__*/React.createElement("div", {
      className: "building_details"
    }, /*#__PURE__*/React.createElement("div", {
      className: "building_visual"
    }, /*#__PURE__*/React.createElement("div", {
      className: "building_visual_inner",
      style: {
        background: `url(${selectedBuilding.background_image}) center`
      }
    })), /*#__PURE__*/React.createElement("div", {
      className: "building_details_contents"
    }, /*#__PURE__*/React.createElement("div", {
      className: "building_details_info_row"
    }, /*#__PURE__*/React.createElement("div", {
      className: "building_info"
    }, /*#__PURE__*/React.createElement("div", {
      className: "building_info_header_row"
    }, /*#__PURE__*/React.createElement("div", {
      className: "building_info_name"
    }, selectedBuilding.tier == 0 && "Basic " + selectedBuilding.name, selectedBuilding.tier > 0 && "Tier " + selectedBuilding.tier + " " + selectedBuilding.name), /*#__PURE__*/React.createElement("div", {
      className: "building_info_phrase"
    }, selectedBuilding.phrase)), /*#__PURE__*/React.createElement("div", {
      className: "building_info_health_row"
    }, /*#__PURE__*/React.createElement("div", {
      className: "building_info_health_bar"
    }, renderHealthBar()), /*#__PURE__*/React.createElement("div", {
      className: "building_info_health_label_row"
    }, /*#__PURE__*/React.createElement("div", {
      className: "building_info_health_label"
    }, "building health"), /*#__PURE__*/React.createElement("div", {
      className: "building_info_health_values"
    }, selectedBuilding.health, " / ", selectedBuilding.max_health), /*#__PURE__*/React.createElement("div", {
      className: "building_info_defense"
    }, "defense ", selectedBuilding.defense))), /*#__PURE__*/React.createElement("div", {
      className: "building_info_description"
    }, selectedBuilding.description)), /*#__PURE__*/React.createElement("div", {
      className: "building_upkeep"
    }, /*#__PURE__*/React.createElement("div", {
      className: "building_upkeep_cost_column"
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: "#e98b99"
      }
    }, upkeep.materials * 24), /*#__PURE__*/React.createElement("span", {
      style: {
        color: "#e98b99"
      }
    }, upkeep.food * 24), /*#__PURE__*/React.createElement("span", {
      style: {
        color: "#e98b99"
      }
    }, upkeep.wealth * 24)), /*#__PURE__*/React.createElement("div", {
      className: "building_upkeep_label_column"
    }, /*#__PURE__*/React.createElement("img", {
      src: "/images/icons/materials.png",
      alt: "materials",
      style: {
        maxHeight: "20px"
      }
    }), /*#__PURE__*/React.createElement("img", {
      src: "/images/icons/food.png",
      alt: "food",
      style: {
        maxHeight: "19px",
        width: "15px"
      }
    }), /*#__PURE__*/React.createElement("img", {
      src: "/images/icons/wealth.png",
      alt: "wealth",
      style: {
        maxHeight: "20px"
      }
    })), /*#__PURE__*/React.createElement("div", {
      className: "building_upkeep_label"
    }, "upkeep/day"))), /*#__PURE__*/React.createElement("div", {
      className: "building_details_controls_row"
    }, /*#__PURE__*/React.createElement("div", {
      className: "building_controls_container"
    }, /*#__PURE__*/React.createElement("div", {
      className: "building_controls_label"
    }, "upgrade to next tier"), /*#__PURE__*/React.createElement("div", {
      className: "building_controls"
    }, /*#__PURE__*/React.createElement("div", {
      className: "building_upgrade_requirements",
      style: {
        background: selectedBuilding.status === "upgrading" ? `linear-gradient(to right, #362a4c 0%, #4c1f2f ${construction_progress_percent / 2}%, #2d1d25 ${construction_progress_percent}%, transparent ${construction_progress_percent}%` : ""
      }
    }, selectedBuilding.tier == 3 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", null, "No upgrades available")), selectedBuilding.status === "upgrading" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "construction_progress_text"
    }, selectedBuilding.construction_time_remaining)), selectedBuilding.tier < 3 && selectedBuilding.status !== "upgrading" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ResourcesDisplay, {
      materials: selectedBuilding.materials_construction_cost,
      food: selectedBuilding.food_construction_cost,
      wealth: selectedBuilding.wealth_construction_cost,
      materialsInadequate: currentMaterials < selectedBuilding.materials_construction_cost,
      foodInadequate: currentFood < selectedBuilding.food_construction_cost,
      wealthInadequate: currentWealth < selectedBuilding.wealth_construction_cost
    }), /*#__PURE__*/React.createElement("img", {
      src: "/images/v2/icons/timer.png",
      alt: "timer",
      style: {
        height: "16px"
      }
    }), /*#__PURE__*/React.createElement("span", null, selectedBuilding.construction_time, " ", selectedBuilding.construction_time > 1 || selectedBuilding.construction_time == 0 ? " days" : " day"))), playerSeatState.seat_type === "kage" && /*#__PURE__*/React.createElement("div", {
      className: "building_buttons_container"
    }, selectedBuilding.status === "default" && /*#__PURE__*/React.createElement(React.Fragment, null, !!selectedBuilding.requirements_met && currentMaterials > selectedBuilding.materials_construction_cost && currentFood > selectedBuilding.food_construction_cost && currentWealth > selectedBuilding.wealth_construction_cost ? /*#__PURE__*/React.createElement("div", {
      className: "construction_begin_button upgrades_control_button",
      onClick: () => openModal({
        header: 'Confirmation',
        text: "Are you sure you want to begin construction of " + selectedBuilding.name + "?\nYou may only have one building under construction at a time.",
        ContentComponent: null,
        onConfirm: () => BeginConstruction()
      })
    }, "build") : /*#__PURE__*/React.createElement("div", {
      className: "construction_begin_button  upgrades_control_button disabled"
    }, "build")), selectedBuilding.status === "upgrading" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "construction_cancel_button upgrades_control_button",
      onClick: () => openModal({
        header: 'Confirmation',
        text: "Are you sure you want to cancel construction of " + selectedBuilding.name + "?\nExisting progress toward construction will be saved.",
        ContentComponent: null,
        onConfirm: () => CancelConstruction()
      })
    }, "cancel"), selectedBuilding.construction_boosted !== "true" ? /*#__PURE__*/React.createElement("div", {
      className: "construction_boost_button upgrades_control_button",
      onClick: () => CheckBoostConstruction()
    }, "boost") : /*#__PURE__*/React.createElement("div", {
      className: "construction_boost_button upgrades_control_button disabled"
    }, "boost")), selectedBuilding.status !== "upgrading" && /*#__PURE__*/React.createElement(React.Fragment, null, selectedBuilding.health < selectedBuilding.max_health ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "repair_begin_button upgrades_control_button",
      onClick: () => openModal({
        header: 'Confirmation',
        text: "sometext?",
        ContentComponent: null,
        onConfirm: () => BeginRepairs()
      })
    }, "repair")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "repair_begin_button upgrades_control_button disabled"
    }, "repair")))))))));
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "upgradespage_container"
  }, /*#__PURE__*/React.createElement("svg", {
    height: "0",
    width: "0"
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("filter", {
    id: "building_hover"
  }, /*#__PURE__*/React.createElement("feGaussianBlur", {
    in: "SourceAlpha",
    stdDeviation: "2",
    result: "blur"
  }), /*#__PURE__*/React.createElement("feFlood", {
    floodColor: "white",
    result: "floodColor"
  }), /*#__PURE__*/React.createElement("feComponentTransfer", {
    in: "blur",
    result: "opacityAdjustedBlur"
  }, /*#__PURE__*/React.createElement("feFuncA", {
    type: "linear",
    slope: "1"
  })), /*#__PURE__*/React.createElement("feComposite", {
    in: "floodColor",
    in2: "opacityAdjustedBlur",
    operator: "in",
    result: "coloredBlur"
  }), /*#__PURE__*/React.createElement("feMerge", null, /*#__PURE__*/React.createElement("feMergeNode", {
    in: "coloredBlur"
  }), /*#__PURE__*/React.createElement("feMergeNode", {
    in: "SourceGraphic"
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "row first"
  }, /*#__PURE__*/React.createElement("div", {
    className: "column first"
  }, /*#__PURE__*/React.createElement("div", {
    className: "header"
  }, "Village Buildings"), /*#__PURE__*/React.createElement("div", {
    className: "buildings_container"
  }, buildingUpgradeDataState.map((building, index) => /*#__PURE__*/React.createElement("div", {
    key: building.key,
    className: "building_item",
    onClick: () => buildingClickHandler(building)
  }, /*#__PURE__*/React.createElement("div", {
    className: "building_item_inner",
    style: {
      background: `url(${building.background_image}) center`
    }
  }, building.status === "upgrading" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "construction_overlay"
  }), /*#__PURE__*/React.createElement("div", {
    className: "construction_progress_overlay",
    style: {
      height: `${building.construction_progress / building.construction_progress_required * 100}%`
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "construction_progress_text_container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "construction_progress_label"
  }, "UNDER CONSTRUCTION"), /*#__PURE__*/React.createElement("div", {
    className: "construction_progress_text"
  }, building.construction_time_remaining)))), /*#__PURE__*/React.createElement("div", {
    className: "building_nameplate"
  }, /*#__PURE__*/React.createElement("div", {
    className: "building_name"
  }, building.tier == 0 && "Basic " + building.name, building.tier > 0 && "Tier " + building.tier + " " + building.name))))), selectedBuilding && /*#__PURE__*/React.createElement("div", {
    className: "building_details_container"
  }, renderBuildingDetails(), /*#__PURE__*/React.createElement(VillageBuildingUpgrades, {
    selectedBuilding: selectedBuilding,
    villageAPI: villageAPI,
    playerSeatState: playerSeatState,
    currentMaterials: currentMaterials,
    currentFood: currentFood,
    currentWealth: currentWealth,
    setSelectedBuilding: setSelectedBuilding,
    setProposalDataState: setProposalDataState,
    setBuildingUpgradeDataState: setBuildingUpgradeDataState
  })))));
}
function VillageBuildingUpgrades({
  selectedBuilding,
  villageAPI,
  playerSeatState,
  currentMaterials,
  currentFood,
  currentWealth,
  setSelectedBuilding,
  setProposalDataState,
  setBuildingUpgradeDataState
}) {
  const [hoveredUpgrade, setHoveredUpgrade] = React.useState(null);
  const [selectedUpgrade, setSelectedUpgrade] = React.useState(null);
  const {
    openModal
  } = useModal();
  const BeginResearch = () => {
    apiFetch(villageAPI, {
      request: 'CreateProposal',
      type: 'begin_research',
      upgrade_key: selectedUpgrade.key
    }).then(response => {
      if (response.errors.length) {
        handleErrors(response.errors);
        return;
      }
      setProposalDataState(response.data.proposalData);
      openModal({
        header: 'Confirmation',
        text: response.data.response_message,
        ContentComponent: null,
        onConfirm: null
      });
    });
  };
  const CancelResearch = () => {
    apiFetch(villageAPI, {
      request: 'CreateProposal',
      type: 'cancel_research',
      upgrade_key: selectedUpgrade.key
    }).then(response => {
      if (response.errors.length) {
        handleErrors(response.errors);
        return;
      }
      setProposalDataState(response.data.proposalData);
      openModal({
        header: 'Confirmation',
        text: response.data.response_message,
        ContentComponent: null,
        onConfirm: null
      });
    });
  };
  const ActivateUpgrade = () => {
    apiFetch(villageAPI, {
      request: 'ActivateUpgrade',
      upgrade_key: selectedUpgrade.key
    }).then(response => {
      if (response.errors.length) {
        handleErrors(response.errors);
        return;
      }
      setBuildingUpgradeDataState(response.data.buildingUpgradeData);
      setSelectedBuilding(response.data.buildingUpgradeData.find(b => b.key === selectedBuilding.key));
      setSelectedUpgrade(null);
      openModal({
        header: 'Confirmation',
        text: response.data.response_message,
        ContentComponent: null,
        onConfirm: null
      });
    });
  };
  const DeactivateUpgrade = () => {
    apiFetch(villageAPI, {
      request: 'DeactivateUpgrade',
      upgrade_key: selectedUpgrade.key
    }).then(response => {
      if (response.errors.length) {
        handleErrors(response.errors);
        return;
      }
      setBuildingUpgradeDataState(response.data.buildingUpgradeData);
      setSelectedBuilding(response.data.buildingUpgradeData.find(b => b.key === selectedBuilding.key));
      setSelectedUpgrade(null);
      openModal({
        header: 'Confirmation',
        text: response.data.response_message,
        ContentComponent: null,
        onConfirm: null
      });
    });
  };
  const CancelActivation = () => {
    apiFetch(villageAPI, {
      request: 'CancelActivation',
      upgrade_key: selectedUpgrade.key
    }).then(response => {
      if (response.errors.length) {
        handleErrors(response.errors);
        return;
      }
      setBuildingUpgradeDataState(response.data.buildingUpgradeData);
      setSelectedBuilding(response.data.buildingUpgradeData.find(b => b.key === selectedBuilding.key));
      setSelectedUpgrade(null);
      openModal({
        header: 'Confirmation',
        text: response.data.response_message,
        ContentComponent: null,
        onConfirm: null
      });
    });
  };
  const CheckBoostResearch = () => {
    apiFetch(villageAPI, {
      request: 'GetResearchBoostCost',
      upgrade_key: selectedUpgrade.key
    }).then(response => {
      if (response.errors.length) {
        handleErrors(response.errors);
        return;
      }
      openModal({
        header: 'Confirmation',
        text: "Boosting the research of this upgrade will cost " + response.data.response_message + " Village Points",
        ContentComponent: null,
        onConfirm: () => BoostResearch()
      });
    });
  };
  const BoostResearch = () => {
    apiFetch(villageAPI, {
      request: 'CreateProposal',
      type: 'boost_research',
      upgrade_key: selectedUpgrade.key
    }).then(response => {
      if (response.errors.length) {
        handleErrors(response.errors);
        return;
      }
      setProposalDataState(response.data.proposalData);
      openModal({
        header: 'Confirmation',
        text: response.data.response_message,
        ContentComponent: null,
        onConfirm: null
      });
    });
  };
  const renderUpgradeItems = upgrade_set => upgrade_set.upgrades.map((upgrade, index) => /*#__PURE__*/React.createElement("div", {
    key: upgrade.key,
    className: `upgrade_item ${upgrade.requirements_met && upgrade.status === "locked" ? "available" : upgrade.status}`,
    onMouseEnter: () => setHoveredUpgrade(upgrade),
    onMouseLeave: () => setHoveredUpgrade(null)
  }, /*#__PURE__*/React.createElement("div", {
    className: "upgrade_item_wrapper",
    onClick: () => setSelectedUpgrade(upgrade)
  }, /*#__PURE__*/React.createElement("div", {
    className: "upgrade_item_inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "upgrade_tier"
  }, romanize(upgrade.tier))))));
  const renderUpgradeDetails = () => {
    const research_progress_percent = selectedUpgrade.research_progress / selectedUpgrade.research_progress_required * 100;
    return /*#__PURE__*/React.createElement("div", {
      className: "upgrade_details_container"
    }, /*#__PURE__*/React.createElement("div", {
      className: "upgrade_name"
    }, selectedUpgrade.name), /*#__PURE__*/React.createElement("div", {
      className: "upgrade_description"
    }, selectedUpgrade.description), /*#__PURE__*/React.createElement("div", {
      className: "upgrade_controls_container"
    }, playerSeatState.seat_type === "kage" && /*#__PURE__*/React.createElement("div", {
      className: "upgrade_buttons_container"
    }, !!selectedUpgrade.requirements_met && selectedUpgrade.status === "locked" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "research_begin_button upgrades_control_button",
      onClick: () => openModal({
        header: 'Confirmation',
        text: "Are you sure you want to begin research for " + selectedUpgrade.name + "?\nYou may only have one upgrade under research at a time.",
        ContentComponent: null,
        onConfirm: () => BeginResearch()
      })
    }, "research")), !!!selectedUpgrade.requirements_met && selectedUpgrade.status === "locked" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "research_begin_button upgrades_control_button disabled"
    }, "research")), selectedUpgrade.status === "researching" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "research_cancel_button upgrades_control_button",
      onClick: () => openModal({
        header: 'Confirmation',
        text: "Are you sure you want to cancel research for " + selectedUpgrade.name + "?\nExisting progress toward research will be saved.",
        ContentComponent: null,
        onConfirm: () => CancelResearch()
      })
    }, "cancel"), selectedUpgrade.research_boosted === "true" ? /*#__PURE__*/React.createElement("div", {
      className: "research_boost_button upgrades_control_button disabled"
    }, "boost") : /*#__PURE__*/React.createElement("div", {
      className: "research_boost_button upgrades_control_button",
      onClick: () => CheckBoostResearch()
    }, "boost")), selectedUpgrade.status === "inactive" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "upgrade_toggle_on_button upgrades_control_button",
      onClick: () => openModal({
        header: 'Confirmation',
        text: "Activating " + selectedUpgrade.name + " will take 3 days and require upkeep during the activation period.",
        ContentComponent: null,
        onConfirm: () => ActivateUpgrade()
      })
    }, "activate")), selectedUpgrade.status === "active" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "upgrade_toggle_off_button upgrades_control_button",
      onClick: () => openModal({
        header: 'Confirmation',
        text: "Are you sure you want to deactivate " + selectedUpgrade.name + "?\nUpkeep will be disabled and reactivation will take 3 days.",
        ContentComponent: null,
        onConfirm: () => DeactivateUpgrade()
      })
    }, "deactivate")), selectedUpgrade.status === "activating" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "upgrade_toggle_off_button upgrades_control_button",
      onClick: () => openModal({
        header: 'Confirmation',
        text: "Are you sure you want to cancel activation for " + selectedUpgrade.name + "?\nUpkeep will be disabled and reactivation will take 3 days.",
        ContentComponent: null,
        onConfirm: () => CancelActivation()
      })
    }, "cancel"))), selectedUpgrade.status === "locked" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "upgrade_controls_label"
    }, "research cost"), /*#__PURE__*/React.createElement("div", {
      className: "upgrade_research_requirements"
    }, /*#__PURE__*/React.createElement(ResourcesDisplay, {
      materials: selectedUpgrade.materials_research_cost,
      food: selectedUpgrade.food_research_cost,
      wealth: selectedUpgrade.wealth_research_cost,
      materialsInadequate: currentMaterials < selectedUpgrade.materials_research_cost,
      foodInadequate: currentFood < selectedUpgrade.food_research_cost,
      wealthInadequate: currentWealth < selectedUpgrade.wealth_research_cost,
      compact: true
    }), /*#__PURE__*/React.createElement("img", {
      src: "/images/v2/icons/timer.png",
      alt: "materials",
      style: {
        height: "16px"
      }
    }), /*#__PURE__*/React.createElement("span", null, selectedUpgrade.research_time, " ", selectedUpgrade.research_time > 1 || selectedUpgrade.research_time == 0 ? " days" : " day")), !selectedUpgrade.requirements_met && /*#__PURE__*/React.createElement("span", {
      className: "research_requirements_message"
    }, selectedUpgrade.requirements_unmet_message)), selectedUpgrade.status === "researching" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "upgrade_controls_label"
    }, "researching"), /*#__PURE__*/React.createElement("div", {
      className: "upgrade_research_requirements",
      style: {
        background: `linear-gradient(to right, #362a4c 0%, #4c1f2f ${research_progress_percent / 2}%, #2d1d25 ${research_progress_percent}%, transparent ${research_progress_percent}%`
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "research_progress_text"
    }, selectedUpgrade.research_time_remaining))), selectedUpgrade.status === "activating" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "upgrade_controls_label"
    }, "activating"), /*#__PURE__*/React.createElement("div", {
      className: "upgrade_research_requirements",
      style: {
        background: `linear-gradient(to right, #362a4c 0%, #4c1f2f ${research_progress_percent / 2}%, #2d1d25 ${research_progress_percent}%, transparent ${research_progress_percent}%`
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "research_progress_text"
    }, selectedUpgrade.research_time_remaining))), (selectedUpgrade.status == "active" || selectedUpgrade.status == "unlocked" || selectedUpgrade.status == "inactive") && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "upgrade_controls_label"
    }, "upkeep cost"), /*#__PURE__*/React.createElement("div", {
      className: "upgrade_research_requirements"
    }, /*#__PURE__*/React.createElement("img", {
      src: "/images/icons/materials.png",
      alt: "materials",
      style: {
        height: "16px"
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        color: "#e98b99"
      }
    }, selectedUpgrade.materials_upkeep), /*#__PURE__*/React.createElement("img", {
      src: "/images/icons/food.png",
      alt: "food",
      style: {
        height: "16px"
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        color: "#e98b99"
      }
    }, selectedUpgrade.food_upkeep), /*#__PURE__*/React.createElement("img", {
      src: "/images/icons/wealth.png",
      alt: "wealth",
      style: {
        height: "16px"
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        color: "#e98b99"
      }
    }, selectedUpgrade.wealth_upkeep), /*#__PURE__*/React.createElement("img", {
      src: "images/v2/icons/timer.png",
      alt: "materials",
      style: {
        height: "16px"
      }
    }), /*#__PURE__*/React.createElement("span", null, "upkeep/hour")))));
  };
  const remainder = selectedBuilding.upgrade_sets.length % 3;
  const fillerDivsNeeded = remainder === 0 ? 0 : 3 - remainder;
  return /*#__PURE__*/React.createElement("div", {
    className: "upgrades_container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "upgrade_set_list"
  }, selectedBuilding.upgrade_sets.map((upgrade_set, index) => /*#__PURE__*/React.createElement("div", {
    key: upgrade_set.key,
    className: "upgrade_set_item"
  }, selectedUpgrade !== null && upgrade_set.upgrades.find(u => u.key === selectedUpgrade.key) ? renderUpgradeDetails() : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "upgrade_set_name"
  }, upgrade_set.name), /*#__PURE__*/React.createElement("div", {
    className: "upgrade_list"
  }, renderUpgradeItems(upgrade_set)), hoveredUpgrade !== null && upgrade_set.upgrades.find(u => u.key === hoveredUpgrade.key) ? /*#__PURE__*/React.createElement("div", {
    className: "upgrade_set_description"
  }, hoveredUpgrade.name, /*#__PURE__*/React.createElement("br", null), hoveredUpgrade.description) : /*#__PURE__*/React.createElement("div", {
    className: "upgrade_set_description"
  }, upgrade_set.description)))).concat(Array.from({
    length: fillerDivsNeeded
  }).map((_, fillerIndex) => /*#__PURE__*/React.createElement("div", {
    key: `filler-${fillerIndex}`,
    className: "upgrade_set_item filler"
  })))));
}
function ResourcesDisplay({
  materials,
  food,
  wealth,
  materialsInadequate = false,
  foodInadequate = false,
  wealthInadequate = false,
  compact = false
}) {
  const adequateColor = "#96eeaf";
  const inadequateColor = "#e98b99";
  return /*#__PURE__*/React.createElement("div", {
    className: `resources_hori_display ${compact ? 'compact' : ''}`
  }, /*#__PURE__*/React.createElement("img", {
    src: "/images/icons/materials.png",
    alt: "materials",
    style: {
      height: "16px"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      color: materialsInadequate ? inadequateColor : adequateColor
    }
  }, materials), /*#__PURE__*/React.createElement("img", {
    src: "/images/icons/food.png",
    alt: "food",
    style: {
      height: "16px"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      color: foodInadequate ? inadequateColor : adequateColor
    }
  }, food), /*#__PURE__*/React.createElement("img", {
    src: "/images/icons/wealth.png",
    alt: "wealth",
    style: {
      height: "16px"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      color: wealthInadequate ? inadequateColor : adequateColor
    }
  }, wealth));
}

// HELPERS

function handleErrors(errors) {
  console.warn(errors);
}
const getBuildingUpkeep = building => {
  let materials_cost = 0;
  let food_cost = 0;
  let wealth_cost = 0;
  building.upgrade_sets.forEach(upgrade_set => {
    upgrade_set.upgrades.forEach(upgrade => {
      if (upgrade.status == "active" || upgrade.status == "activating") {
        materials_cost += upgrade.materials_upkeep;
        food_cost += upgrade.food_upkeep;
        wealth_cost += upgrade.wealth_upkeep;
      }
    });
  });
  return {
    materials: materials_cost,
    food: food_cost,
    wealth: wealth_cost
  };
};
function romanize(num) {
  switch (num) {
    case 1:
      return "I";
    case 2:
      return "II";
    case 3:
      return "III";
    case 4:
      return "IV";
    case 5:
      return "V";
    case 6:
      return "VI";
    case 7:
      return "VII";
    case 8:
      return "VIII";
    case 9:
      return "IX";
    case 10:
      return "X";
    default:
      return "I";
  }
}