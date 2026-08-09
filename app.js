(function () {
      "use strict";

      const earthKm = 6371.0088;
      const osrmEndpoints = [
        "https://routing.openstreetmap.de/routed-bike/route/v1/bike/",
        "https://router.project-osrm.org/route/v1/bike/"
      ];
      const overpassEndpoints = [
        "https://overpass-api.de/api/interpreter",
        "https://overpass.kumi.systems/api/interpreter",
        "https://overpass.openstreetmap.ru/api/interpreter"
      ];
      const pavedSurfaces = new Set(["asphalt", "paved", "concrete", "concrete:plates", "concrete:lanes", "paving_stones", "sett", "compacted"]);
      const roughSurfaces = new Set(["unpaved", "gravel", "fine_gravel", "ground", "earth", "dirt", "sand", "grass", "mud", "woodchips"]);
      const forbiddenHighways = new Set(["motorway", "motorway_link", "trunk", "trunk_link"]);
      const nationalHighways = new Set(["primary", "primary_link"]);
      const voivodeshipHighways = new Set(["secondary", "secondary_link"]);
      const localHighways = new Set(["tertiary", "tertiary_link", "unclassified", "residential", "living_street", "service", "cycleway"]);

      const dom = {
        menuOpenBtn: document.getElementById("menuOpenBtn"),
        menuCloseBtn: document.getElementById("menuCloseBtn"),
        appMenu: document.getElementById("appMenu"),
        menuCards: Array.from(document.querySelectorAll(".menu-card")),
        menuPanelPlanner: document.getElementById("menuPanelPlanner"),
        menuPanelHelp: document.getElementById("menuPanelHelp"),
        menuPanelSummary: document.getElementById("menuPanelSummary"),
        menuSummaryDistance: document.getElementById("menuSummaryDistance"),
        menuSummaryTime: document.getElementById("menuSummaryTime"),
        menuSummaryLaps: document.getElementById("menuSummaryLaps"),
        menuSummaryAscent: document.getElementById("menuSummaryAscent"),
        menuSummaryGrade: document.getElementById("menuSummaryGrade"),
        menuSummaryRoads: document.getElementById("menuSummaryRoads"),
        menuSummaryForest: document.getElementById("menuSummaryForest"),
        menuSummaryMode: document.getElementById("menuSummaryMode"),
        menuBackToPlannerBtn: document.getElementById("menuBackToPlannerBtn"),
        menuExportGpxBtn: document.getElementById("menuExportGpxBtn"),
        menuCopyPngBtn: document.getElementById("menuCopyPngBtn"),
        menuDownloadPngBtn: document.getElementById("menuDownloadPngBtn"),
        mobileSettingsToggle: document.getElementById("mobileSettingsToggle"),
        settingsPanel: document.getElementById("settingsPanel"),
        searchInput: document.getElementById("searchInput"),
        finishInput: document.getElementById("finishInput"),
        searchBtn: document.getElementById("searchBtn"),
        searchFinishBtn: document.getElementById("searchFinishBtn"),
        gpsBtn: document.getElementById("gpsBtn"),
        pickStartBtn: document.getElementById("pickStartBtn"),
        pickFinishBtn: document.getElementById("pickFinishBtn"),
        results: document.getElementById("results"),
        routeMode: document.getElementById("routeMode"),
        targetKm: document.getElementById("targetKm"),
        maxRadiusKm: document.getElementById("maxRadiusKm"),
        lapCount: document.getElementById("lapCount"),
        flatWeight: document.getElementById("flatWeight"),
        flatWeightOut: document.getElementById("flatWeightOut"),
        maxGrade: document.getElementById("maxGrade"),
        targetGrade: document.getElementById("targetGrade"),
        roadStrictness: document.getElementById("roadStrictness"),
        avgSpeed: document.getElementById("avgSpeed"),
        riderWeight: document.getElementById("riderWeight"),
        bikeWeight: document.getElementById("bikeWeight"),
        bikeType: document.getElementById("bikeType"),
        timeEstimateOut: document.getElementById("timeEstimateOut"),
        calorieEstimateOut: document.getElementById("calorieEstimateOut"),
        repeatGpx: document.getElementById("repeatGpx"),
        attempts: document.getElementById("attempts"),
        attemptsOut: document.getElementById("attemptsOut"),
        loopBtn: document.getElementById("loopBtn"),
        rerouteBtn: document.getElementById("rerouteBtn"),
        routePreset: document.getElementById("routePreset"),
        mapStyle: document.getElementById("mapStyle"),
                themeStyle: document.getElementById("themeStyle"),
presetDescription: document.getElementById("presetDescription"),
        autoReroute: document.getElementById("autoReroute"),
        addPointBtn: document.getElementById("addPointBtn"),
        undoPointBtn: document.getElementById("undoPointBtn"),
        drawAreaBtn: document.getElementById("drawAreaBtn"),
        clearAreaBtn: document.getElementById("clearAreaBtn"),
        clearBtn: document.getElementById("clearBtn"),
        randomRouteBtn: document.getElementById("randomRouteBtn"),
        reverseRouteBtn: document.getElementById("reverseRouteBtn"),
        manualCorrectionBtn: document.getElementById("manualCorrectionBtn"),
        gpxBtn: document.getElementById("gpxBtn"),
        weatherBtn: document.getElementById("weatherBtn"),
        weatherPanel: document.getElementById("weatherPanel"),
        weatherCloseBtn: document.getElementById("weatherCloseBtn"),
        weatherSummary: document.getElementById("weatherSummary"),
        weatherTimeMode: document.getElementById("weatherTimeMode"),
        weatherTimeOffset: document.getElementById("weatherTimeOffset"),
        weatherTimeLabel: document.getElementById("weatherTimeLabel"),
        weatherScaleNow: document.getElementById("weatherScaleNow"),
        weatherScaleMid: document.getElementById("weatherScaleMid"),
        weatherScaleEnd: document.getElementById("weatherScaleEnd"),
        weatherRouteMarkersBtn: document.getElementById("weatherRouteMarkersBtn"),
        weatherSliderToggleBtn: document.getElementById("weatherSliderToggleBtn"),
        weatherTimeControl: document.getElementById("weatherTimeControl"),
        weatherGrid: document.getElementById("weatherGrid"),
        weatherWidget: document.getElementById("weatherWidget"),
        weatherWidgetMain: document.getElementById("weatherWidgetMain"),
        weatherWidgetSub: document.getElementById("weatherWidgetSub"),
        windZonePanel: document.getElementById("windZonePanel"),
        mapLegend: document.getElementById("mapLegend"),
        legendToggleBtn: document.getElementById("legendToggleBtn"),
        routeReportPanel: document.getElementById("routeReportPanel"),
        routeReportTitle: document.getElementById("routeReportTitle"),
        routeReportCloseBtn: document.getElementById("routeReportCloseBtn"),
        routeReportSummary: document.getElementById("routeReportSummary"),
        routeReportDetails: document.getElementById("routeReportDetails"),
        routeWarningList: document.getElementById("routeWarningList"),
        routeStopList: document.getElementById("routeStopList"),
        routeNearbyList: document.getElementById("routeNearbyList"),
        correctionPanel: document.getElementById("correctionPanel"),
        correctionTitle: document.getElementById("correctionTitle"),
        correctionCloseBtn: document.getElementById("correctionCloseBtn"),
        correctionType: document.getElementById("correctionType"),
        correctionRange: document.getElementById("correctionRange"),
        correctionRangeOut: document.getElementById("correctionRangeOut"),
        correctionApplyBtn: document.getElementById("correctionApplyBtn"),
        correctionRemoveBtn: document.getElementById("correctionRemoveBtn"),
        correctionHint: document.getElementById("correctionHint"),
        importGpxBtn: document.getElementById("importGpxBtn"),
        quickImportTopBtn: document.getElementById("quickImportTopBtn"),
        importGpxFile: document.getElementById("importGpxFile"),
        fullscreenBtn: document.getElementById("fullscreenBtn"),
        quickFullscreenBtn: document.getElementById("quickFullscreenBtn"),
        mapMenuToggleBtn: document.getElementById("mapMenuToggleBtn"),
        quickShopsBtn: document.getElementById("quickShopsBtn"),
        quickAttractionsBtn: document.getElementById("quickAttractionsBtn"),
        tripPlanBtn: document.getElementById("tripPlanBtn"),
        routeLodgingBtn: document.getElementById("routeLodgingBtn"),
        routeStopsBtn: document.getElementById("routeStopsBtn"),
        routeAttractionsBtn: document.getElementById("routeAttractionsBtn"),
        routeReportBtn: document.getElementById("routeReportBtn"),
        quickCorrectionBtn: document.getElementById("quickCorrectionBtn"),
        routeColorBtn: document.getElementById("routeColorBtn"),
        layerClimbsToggle: document.getElementById("layerClimbsToggle"),
        layerFatigueToggle: document.getElementById("layerFatigueToggle"),
        layerWeatherToggle: document.getElementById("layerWeatherToggle"),
        layerBreaksToggle: document.getElementById("layerBreaksToggle"),
        layerPoisToggle: document.getElementById("layerPoisToggle"),
        layerCorrectionsToggle: document.getElementById("layerCorrectionsToggle"),
        breakEveryKm: document.getElementById("breakEveryKm"),
        fullscreenReportBtn: document.getElementById("fullscreenReportBtn"),
        fullscreenTripPlanBtn: document.getElementById("fullscreenTripPlanBtn"),
        fullscreenLodgingBtn: document.getElementById("fullscreenLodgingBtn"),
        fullscreenStopsBtn: document.getElementById("fullscreenStopsBtn"),
        fullscreenRouteAttractionsBtn: document.getElementById("fullscreenRouteAttractionsBtn"),
        fullscreenAttractionsBtn: document.getElementById("fullscreenAttractionsBtn"),
        fullscreenColorBtn: document.getElementById("fullscreenColorBtn"),
        fullscreenCorrectionBtn: document.getElementById("fullscreenCorrectionBtn"),
        fullscreenCopyShotBtn: document.getElementById("fullscreenCopyShotBtn"),
        fullscreenDownloadShotBtn: document.getElementById("fullscreenDownloadShotBtn"),
        fullscreenExitBtn: document.getElementById("fullscreenExitBtn"),
        fullscreenMenuToggleBtn: document.getElementById("fullscreenMenuToggleBtn"),
        copyShotBtn: document.getElementById("copyShotBtn"),
        downloadShotBtn: document.getElementById("downloadShotBtn"),
        topMenuToggleBtn: document.getElementById("topMenuToggleBtn"),
        saveProjectBtn: document.getElementById("saveProjectBtn"),
        loadProjectBtn: document.getElementById("loadProjectBtn"),
        loadProjectFile: document.getElementById("loadProjectFile"),
        avoidNationalRoads: document.getElementById("avoidNationalRoads"),
        avoidVoivodeshipRoads: document.getElementById("avoidVoivodeshipRoads"),
        avoidForestAuto: document.getElementById("avoidForestAuto"),
        preferAsphalt: document.getElementById("preferAsphalt"),
        preferBikeRoutes: document.getElementById("preferBikeRoutes"),
        showFoodShops: document.getElementById("showFoodShops"),
        showAttractions: document.getElementById("showAttractions"),
        status: document.getElementById("status"),
        mapBusyTimer: document.getElementById("mapBusyTimer"),
        mapBusyLabel: document.getElementById("mapBusyLabel"),
        mapBusyElapsed: document.getElementById("mapBusyElapsed"),
        mapBusyEta: document.getElementById("mapBusyEta"),
        rideRemaining: document.getElementById("rideRemaining"),
        rideOffRoute: document.getElementById("rideOffRoute"),
        rideGrade: document.getElementById("rideGrade"),
        rideNextClimb: document.getElementById("rideNextClimb"),
        clockDate: document.getElementById("clockDate"),
        clockTime: document.getElementById("clockTime"),
        profileCanvas: document.getElementById("profileCanvas"),
        profileZoomOutBtn: document.getElementById("profileZoomOutBtn"),
        profileZoomInBtn: document.getElementById("profileZoomInBtn"),
        profileZoomResetBtn: document.getElementById("profileZoomResetBtn"),
        profileAutoPlayBtn: document.getElementById("profileAutoPlayBtn"),
        profileAutoStopBtn: document.getElementById("profileAutoStopBtn"),
        profileZoomLabel: document.getElementById("profileZoomLabel"),
        profileInfo: document.getElementById("profileInfo"),
        qualityBadge: document.getElementById("qualityBadge"),
        qualityHelp: document.getElementById("qualityHelp"),
        variantPanel: document.getElementById("variantPanel"),
        variantTitle: document.getElementById("variantTitle"),
        variantList: document.getElementById("variantList"),
        hideVariantsBtn: document.getElementById("hideVariantsBtn"),
        showVariantsBtn: document.getElementById("showVariantsBtn"),
        metricDistance: document.getElementById("metricDistance"),
        metricTime: document.getElementById("metricTime"),
        metricAscent: document.getElementById("metricAscent"),
        metricGrade: document.getElementById("metricGrade"),
        metricRadius: document.getElementById("metricRadius"),
        metricRoadRisk: document.getElementById("metricRoadRisk"),
        metricForest: document.getElementById("metricForest"),
        metricCalories: document.getElementById("metricCalories")
      };

      const state = {
        start: L.latLng(52.2297, 21.0122),
        finish: null,
        waypoints: [],
        routeLatLngs: [],
        routeDistances: [],
        guideLatLngs: [],
        markers: [],
        osmCache: new Map(),
        areaPoints: [],
        drawingArea: false,
        areaMouseDown: false,
        profileLatLngs: [],
        profileDistances: [],
        profileElevations: [],
        profileSmoothElevations: [],
        profileHoverIndex: -1,
        profileZoom: 1,
        profileZoomCenter: 0.5,
        profileRequestId: 0,
        autoPlayActive: false,
        autoPlayPaused: false,
        autoPlayRafId: 0,
        autoPlayStartedAt: 0,
        autoPlayPausedAt: 0,
        autoPlayDurationSec: 0,
        autoPlayDistanceKm: 0,
        rideMode: false,
        rideWatchId: null,
        rideMarker: null,
        rideAccuracyCircle: null,
        mobileSettingsOpen: false,
        suppressMapClickUntil: 0,
        busyStartedAt: 0,
        busyEstimateSec: 0,
        busyTimerId: null,
        busyLabel: "Liczenie trasy",
        mode: "idle",
        busy: false,
        pickingStart: false,
        pickingFinish: false,
        addingPoint: false,
        customRouteTimerId: null,
        weatherRequestId: 0,
        weatherItems: [],
        weatherCacheKey: "",
        weatherCacheAt: 0,
        weatherRouteMarkersVisible: true,
        weatherSliderCollapsed: false,
        weatherTimeMode: "ride",
        weatherHourOffset: 0,
        weatherRefreshTimerId: null,
        shopRequestId: 0,
        shopRefreshTimerId: null,
        shopCacheKey: "",
        attractionRequestId: 0,
        attractionRefreshTimerId: null,
        attractionCacheKey: "",
        routeAttractionRequestId: 0,
        routeAttractions: [],
        routeLodgings: [],
        routeFoodShops: [],
        routeWarnings: [],
        routeColorMode: "slope",
        stats: null,
        activeRoutePreset: "balanced",
        routeSearchNonce: 0,
        previousRouteLatLngs: [],
        avoidPreviousRoute: false,
        variantChoices: [],
        activeVariantIndex: -1,
        lockedWaypoints: new Set(),
        layerVisibility: { climbs: true, fatigue: true, weather: true, breaks: true, pois: true, corrections: true }
      };

      const savedVariantLimit = 6;
      const finalistAnalyzeLimit = 3;
      const candidateRouteConcurrency = 4;
      const osmAnalysisConcurrency = 2;

      const map = L.map("map", {
        zoomControl: false,
        preferCanvas: true
      }).setView(state.start, 12);
      if (map.getPane("tooltipPane")) map.getPane("tooltipPane").style.zIndex = 960;
      if (map.getPane("popupPane")) map.getPane("popupPane").style.zIndex = 970;
      map.createPane("climbPane");
      map.getPane("climbPane").style.zIndex = 680;
      map.getPane("climbPane").style.pointerEvents = "none";
      map.createPane("fatiguePane");
      map.getPane("fatiguePane").style.zIndex = 690;
      map.getPane("fatiguePane").style.pointerEvents = "none";
      map.createPane("windPane");
      map.getPane("windPane").style.zIndex = 675;
      map.getPane("windPane").style.pointerEvents = "none";
      map.createPane("weatherPane");
      map.getPane("weatherPane").style.zIndex = 710;
      map.getPane("weatherPane").style.pointerEvents = "auto";
      map.createPane("routeHoverPane");
      map.getPane("routeHoverPane").style.zIndex = 880;
      map.getPane("routeHoverPane").style.pointerEvents = "none";
      map.createPane("shopsPane");
      map.getPane("shopsPane").style.zIndex = 720;
      map.getPane("shopsPane").style.pointerEvents = "auto";
      map.createPane("attractionsPane");
      map.getPane("attractionsPane").style.zIndex = 730;
      map.getPane("attractionsPane").style.pointerEvents = "auto";

      L.control.zoom({ position: "bottomleft" }).addTo(map);

      const mapLayers = {
        osm: {
          url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          options: {
            maxZoom: 19,
            crossOrigin: true,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          }
        },
        cycle: {
          url: "https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png",
          fallbackUrls: [
            "https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm-lite/{z}/{x}/{y}.png",
            "https://{s}.tile.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png"
          ],
          options: {
            maxZoom: 20,
            crossOrigin: true,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | <a href="https://www.cyclosm.org/">CyclOSM</a>'
          }
        },
        topo: {
          url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
          options: {
            maxZoom: 17,
            crossOrigin: true,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | <a href="https://opentopomap.org/">OpenTopoMap</a>'
          }
        },
        satellite: {
          url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          options: {
            maxZoom: 19,
            crossOrigin: true,
            attribution: "Tiles &copy; Esri"
          }
        }
      };

      let activeBaseLayer = null;
      let activeBaseFallbackId = 0;

      function createBaseLayer(selected, key, fallbackIndex) {
        const urls = [selected.url].concat(selected.fallbackUrls || []);
        const safeIndex = clamp(fallbackIndex || 0, 0, urls.length - 1);
        const layer = L.tileLayer(urls[safeIndex], selected.options);
        let tileErrors = 0;
        layer.on("tileerror", () => {
          tileErrors += 1;
          if (tileErrors < 3 || safeIndex >= urls.length - 1 || activeBaseLayer !== layer) return;
          const fallbackId = ++activeBaseFallbackId;
          window.setTimeout(() => {
            if (fallbackId !== activeBaseFallbackId || activeBaseLayer !== layer) return;
            map.removeLayer(layer);
            activeBaseLayer = createBaseLayer(selected, key, safeIndex + 1).addTo(map);
            if (key === "cycle") {
              setStatus("Mapa rowerowa CyclOSM nie odpowiedziała, przełączyłem na zapasowy wariant rowerowy.", "warn");
            }
          }, 250);
        });
        return layer;
      }

      function switchMapLayer(style) {
        const key = mapLayers[style] ? style : "osm";
        const selected = mapLayers[key];
        activeBaseFallbackId += 1;
        if (activeBaseLayer) {
          map.removeLayer(activeBaseLayer);
        }
        activeBaseLayer = createBaseLayer(selected, key, 0).addTo(map);
        if (dom.mapStyle && dom.mapStyle.value !== key) {
          dom.mapStyle.value = key;
        }
      }

      switchMapLayer(dom.mapStyle ? dom.mapStyle.value : "osm");

      const routeLayer = L.geoJSON(null, {
        style: {
          color: "#2f86ff",
          weight: 1,
          opacity: 0,
          lineJoin: "round",
          lineCap: "round"
        }
      }).addTo(map);

      const routeShadeLayer = L.layerGroup().addTo(map);
      const routeDirectionLayer = L.layerGroup().addTo(map);
      const windQuarterLayer = L.layerGroup([], { pane: "windPane" }).addTo(map);
      const manualCorrectionLayer = L.layerGroup().addTo(map);
      const climbBadgeLayer = L.layerGroup([], { pane: "climbPane" }).addTo(map);
      const fatigueBadgeLayer = L.layerGroup([], { pane: "fatiguePane" }).addTo(map);
      const weatherHazardLayer = L.layerGroup([], { pane: "weatherPane" }).addTo(map);
      const weatherDetailLayer = L.layerGroup([], { pane: "weatherPane" }).addTo(map);
      const foodShopLayer = L.layerGroup().addTo(map);
      const routeFoodShopLayer = L.layerGroup().addTo(map);
      const routeAttractionLayer = L.layerGroup().addTo(map);
      const routeLodgingLayer = L.layerGroup().addTo(map);
      const attractionLayer = L.layerGroup().addTo(map);
      const plannedBreakLayer = L.layerGroup().addTo(map);

      const overlayLayerGroups = {
        climbs: [climbBadgeLayer],
        fatigue: [fatigueBadgeLayer],
        weather: [weatherHazardLayer, weatherDetailLayer],
        breaks: [plannedBreakLayer],
        pois: [foodShopLayer, routeFoodShopLayer, routeAttractionLayer, routeLodgingLayer, attractionLayer],
        corrections: [manualCorrectionLayer]
      };

      function setLayerGroupVisible(group, visible) {
        if (!group) return;
        const onMap = map.hasLayer(group);
        if (visible && !onMap) group.addTo(map);
        if (!visible && onMap) map.removeLayer(group);
      }

      function applyLayerVisibility(key, visible, announce) {
        if (!Object.prototype.hasOwnProperty.call(state.layerVisibility, key)) return;
        state.layerVisibility[key] = !!visible;
        (overlayLayerGroups[key] || []).forEach((group) => setLayerGroupVisible(group, state.layerVisibility[key]));
        const control = dom["layer" + key.charAt(0).toUpperCase() + key.slice(1) + "Toggle"];
        if (control && control.checked !== state.layerVisibility[key]) control.checked = state.layerVisibility[key];
        if (announce) {
          const labels = { climbs: "podjazdy %", fatigue: "ciężkie odcinki", weather: "pogoda", breaks: "przerwy", pois: "sklepy/atrakcje/noclegi", corrections: "korekty" };
          setStatus((state.layerVisibility[key] ? "Pokazuję: " : "Ukrywam: ") + (labels[key] || key) + ".");
        }
      }

      function applyAllLayerVisibility() {
        Object.keys(state.layerVisibility).forEach((key) => applyLayerVisibility(key, state.layerVisibility[key], false));
      }

      const routeHitLayer = L.geoJSON(null, {
        style: {
          color: "#2f86ff",
          weight: 34,
          opacity: 0.01,
          interactive: true
        }
      }).addTo(map);

      const guideLayer = L.polyline([], {
        color: "#7aeaff",
        weight: 3,
        opacity: 0.82,
        dashArray: "8 8"
      }).addTo(map);

      const areaLayer = L.polygon([], {
        color: "#ff2fb2",
        weight: 2,
        opacity: 0.92,
        fillColor: "#2f86ff",
        fillOpacity: 0.14
      }).addTo(map);

      const areaSketchLayer = L.polyline([], {
        color: "#ff2fb2",
        weight: 3,
        opacity: 0.82,
        dashArray: "6 6"
      }).addTo(map);

      const routeHoverMarker = L.circleMarker(state.start, {
        pane: "routeHoverPane",
        radius: 7,
        color: "#050711",
        weight: 2,
        fillColor: "#ff2fb2",
        fillOpacity: 0,
        opacity: 0,
        interactive: false
      }).addTo(map);
      routeHoverMarker.bindTooltip("", {
        pane: "routeHoverPane",
        className: "route-hover-tip",
        direction: "top",
        offset: [0, -9],
        opacity: 0.98
      });

      const autoPlayMarker = L.marker(state.start, {
        pane: "routeHoverPane",
        interactive: false,
        keyboard: false,
        opacity: 0,
        icon: L.divIcon({
          className: "",
          html: '<div class="auto-ride-marker"><span>🚲</span></div>',
          iconSize: [38, 38],
          iconAnchor: [19, 19]
        })
      }).addTo(map);
      autoPlayMarker.bindTooltip("", {
        pane: "routeHoverPane",
        className: "route-hover-tip auto-ride-tip",
        direction: "top",
        offset: [0, -22],
        opacity: 0.99
      });

      const radiusCircle = L.circle(state.start, {
        radius: Number(dom.maxRadiusKm.value) * 1000,
        color: "#7aeaff",
        weight: 2,
        opacity: 0.55,
        fillOpacity: 0.04
      }).addTo(map);

      const profileCtx = dom.profileCanvas.getContext("2d");

      function setStatus(text, type) {
        dom.status.textContent = text;
        dom.status.className = "status" + (type ? " " + type : "");
      }

      function refreshMenuSummary() {
        return;
      }

      function setMenuView(view) {
        const nextView = view || "planner";
        const panels = {
          planner: dom.menuPanelPlanner,
          help: dom.menuPanelHelp,
          summary: dom.menuPanelSummary
        };
        for (const card of dom.menuCards) {
          card.classList.toggle("active", card.dataset.menuView === nextView);
        }
        for (const [name, panel] of Object.entries(panels)) {
          if (panel) panel.classList.toggle("active", name === nextView);
        }
        
      }

      function openMainMenu(view) {
        dom.appMenu.classList.add("visible");
        dom.appMenu.setAttribute("aria-hidden", "false");
        setMenuView(view || "planner");
      }

      function closeMainMenu() {
        dom.appMenu.classList.remove("visible");
        dom.appMenu.setAttribute("aria-hidden", "true");
        window.setTimeout(() => {
          map.invalidateSize();
          drawProfile(state.stats ? state.stats.elevations : []);
        }, 80);
      }

      function formatBusyTime(seconds) {
        const safeSeconds = Math.max(0, Math.floor(seconds || 0));
        const minutes = Math.floor(safeSeconds / 60);
        const rest = safeSeconds % 60;
        return String(minutes).padStart(2, "0") + ":" + String(rest).padStart(2, "0");
      }

      function updateBusyTimer() {
        if (!state.busyStartedAt || !dom.mapBusyTimer) return;
        const elapsed = Math.floor((Date.now() - state.busyStartedAt) / 1000);
        dom.mapBusyLabel.textContent = state.busyLabel || "Liczenie trasy";
        dom.mapBusyElapsed.textContent = formatBusyTime(elapsed);
        if (state.busyEstimateSec > 0) {
          const remaining = Math.max(0, state.busyEstimateSec - elapsed);
          dom.mapBusyEta.textContent = remaining > 0
            ? "około " + formatBusyTime(remaining) + " do końca"
            : "kończę analizę...";
        } else {
          dom.mapBusyEta.textContent = "czas zależy od map i internetu";
        }
      }

      function startBusyTimer(label, estimateSeconds) {
        state.busyStartedAt = Date.now();
        state.busyLabel = label || "Liczenie trasy";
        state.busyEstimateSec = Math.max(0, Math.round(estimateSeconds || 0));
        if (dom.mapBusyTimer) dom.mapBusyTimer.classList.add("visible");
        if (state.busyTimerId) window.clearInterval(state.busyTimerId);
        updateBusyTimer();
        state.busyTimerId = window.setInterval(updateBusyTimer, 1000);
      }

      function configureBusyTimer(label, estimateSeconds) {
        if (!state.busy) return;
        if (!state.busyStartedAt) {
          startBusyTimer(label, estimateSeconds);
          return;
        }
        state.busyLabel = label || state.busyLabel || "Liczenie trasy";
        state.busyEstimateSec = Math.max(0, Math.round(estimateSeconds || state.busyEstimateSec || 0));
        updateBusyTimer();
      }

      function stopBusyTimer() {
        if (state.busyTimerId) {
          window.clearInterval(state.busyTimerId);
          state.busyTimerId = null;
        }
        state.busyStartedAt = 0;
        state.busyEstimateSec = 0;
        if (dom.mapBusyTimer) dom.mapBusyTimer.classList.remove("visible");
      }

      function setBusy(isBusy) {
        state.busy = isBusy;
        for (const button of [dom.searchBtn, dom.searchFinishBtn, dom.gpsBtn, dom.loopBtn, dom.rerouteBtn, dom.addPointBtn, dom.undoPointBtn, dom.drawAreaBtn, dom.randomRouteBtn, dom.gpxBtn, dom.weatherBtn, dom.importGpxBtn, dom.quickImportTopBtn, dom.fullscreenBtn, dom.quickFullscreenBtn, dom.quickShopsBtn, dom.quickAttractionsBtn, dom.routeStopsBtn, dom.routeAttractionsBtn, dom.tripPlanBtn, dom.routeLodgingBtn, dom.routeReportBtn, dom.routeColorBtn, dom.fullscreenReportBtn, dom.fullscreenTripPlanBtn, dom.fullscreenLodgingBtn, dom.fullscreenStopsBtn, dom.fullscreenRouteAttractionsBtn, dom.fullscreenAttractionsBtn, dom.fullscreenColorBtn, dom.fullscreenCopyShotBtn, dom.fullscreenDownloadShotBtn, dom.fullscreenExitBtn, dom.copyShotBtn, dom.downloadShotBtn, dom.saveProjectBtn, dom.loadProjectBtn]) {
          if (!button) continue;
          button.disabled = isBusy;
        }
        if (!isBusy) stopBusyTimer();
      }

      function setMobileSettings(open) {
        state.mobileSettingsOpen = !!open;
        if (dom.settingsPanel) dom.settingsPanel.classList.toggle("mobile-open", state.mobileSettingsOpen);
        if (dom.mobileSettingsToggle) {
          dom.mobileSettingsToggle.textContent = state.mobileSettingsOpen ? "Zamknij ustawienia" : "Ustawienia trasy";
        }
        window.setTimeout(() => {
          map.invalidateSize();
          drawProfile(state.stats ? state.stats.elevations : []);
        }, 240);
      }

      function toggleMobileSettings() {
        setMobileSettings(!state.mobileSettingsOpen);
      }

      function updateClock() {
        const now = new Date();
        const pad = (value) => String(value).padStart(2, "0");
        dom.clockDate.textContent = pad(now.getDate()) + "." + pad(now.getMonth() + 1) + "." + now.getFullYear();
        dom.clockTime.textContent = pad(now.getHours()) + ":" + pad(now.getMinutes()) + ":" + pad(now.getSeconds());
      }

      function formatRideTime(distanceKm) {
        const speed = clamp(Number(dom.avgSpeed.value) || 20, 1, 80);
        const minutes = Math.round(distanceKm / speed * 60);
        const hours = Math.floor(minutes / 60);
        const rest = minutes % 60;
        return hours + ":" + String(rest).padStart(2, "0");
      }

      function getLapCount() {
        return clamp(Math.round(Number(dom.lapCount.value) || 1), 1, 20);
      }

      function targetTrainingKm() {
        return (Number(dom.targetKm.value) || 0) * getLapCount();
      }

      function routeTrainingKm(stats) {
        return (stats ? stats.distanceKm || 0 : 0) * getLapCount();
      }

      function bikeCalorieFactor() {
        const factors = {
          road: 0.94,
          gravel: 1,
          mtb: 1.14,
          city: 1.08
        };
        return factors[dom.bikeType && dom.bikeType.value] || factors.gravel;
      }

      function speedCalorieFactor() {
        const speed = clamp(Number(dom.avgSpeed && dom.avgSpeed.value) || 20, 8, 45);
        return clamp(0.78 + Math.pow(speed / 20, 1.55) * 0.22, 0.78, 1.6);
      }

      function routeQualityCalorieFactor(stats) {
        if (!stats) return 1;
        const trainingKm = Math.max(1, routeTrainingKm(stats));
        const laps = getLapCount();
        const risk = clamp((stats.roadRiskPercent || 0) / 100, 0, 1);
        const unpaved = clamp(((stats.unpavedKm || 0) * laps) / trainingKm, 0, 1);
        const forest = clamp(((stats.forestKm || 0) * laps) / trainingKm, 0, 1);
        return clamp(1 + risk * 0.12 + unpaved * 0.22 + forest * 0.08, 0.92, 1.32);
      }

      function estimateCalories(distanceKm, ascentM, stats) {
        const riderKg = clamp(Number(dom.riderWeight && dom.riderWeight.value) || 80, 35, 180);
        const bikeKg = clamp(Number(dom.bikeWeight && dom.bikeWeight.value) || 10, 5, 35);
        const totalKg = riderKg + bikeKg;
        const distance = Math.max(0, distanceKm || 0);
        const base = distance * totalKg * 0.31 * bikeCalorieFactor() * speedCalorieFactor() * routeQualityCalorieFactor(stats);
        const climbing = Math.max(0, ascentM || 0) * totalKg * 0.0065;
        return Math.max(0, Math.round(base + climbing));
      }

      function calorieEstimate(stats) {
        const laps = getLapCount();
        const distanceKm = stats ? routeTrainingKm(stats) : targetTrainingKm();
        const ascentM = stats ? (stats.ascentM || 0) * laps : 0;
        return estimateCalories(distanceKm, ascentM, stats);
      }

      function profileZoomRange(length) {
        const total = Math.max(2, length || state.profileElevations.length || 2);
        const zoom = clamp(state.profileZoom || 1, 1, 12);
        const visible = Math.max(2, Math.ceil(total / zoom));
        const maxStart = Math.max(0, total - visible);
        const center = clamp(state.profileZoomCenter == null ? 0.5 : state.profileZoomCenter, 0, 1);
        const start = clamp(Math.round(center * total - visible / 2), 0, maxStart);
        const end = Math.min(total - 1, start + visible - 1);
        return { start, end, zoom, visible, total };
      }

      function updateProfileZoomLabel() {
        if (!dom.profileZoomLabel) return;
        const zoom = clamp(state.profileZoom || 1, 1, 12);
        dom.profileZoomLabel.textContent = Math.round(zoom * 100) + "%";
      }

      function setProfileZoom(nextZoom, centerRatio) {
        if (centerRatio != null) state.profileZoomCenter = clamp(centerRatio, 0, 1);
        state.profileZoom = clamp(nextZoom, 1, 12);
        updateProfileZoomLabel();
        drawProfile(state.profileElevations);
      }

      function resetProfileZoom() {
        state.profileZoom = 1;
        state.profileZoomCenter = 0.5;
        updateProfileZoomLabel();
        drawProfile(state.profileElevations);
      }

      function profileIndexFromCanvasRatio(ratio) {
        const length = state.profileElevations.length;
        if (length < 2) return 0;
        const range = profileZoomRange(length);
        return clamp(Math.round(range.start + clamp(ratio, 0, 1) * Math.max(1, range.end - range.start)), 0, length - 1);
      }

      function profileIndexFromDistanceKm(distanceKm) {
        if (!state.profileDistances.length) return 0;
        const targetKm = clamp(distanceKm || 0, 0, state.profileDistances[state.profileDistances.length - 1] || 0);
        let low = 0;
        let high = state.profileDistances.length - 1;
        while (low < high) {
          const mid = Math.floor((low + high) / 2);
          if ((state.profileDistances[mid] || 0) < targetKm) low = mid + 1;
          else high = mid;
        }
        const prev = Math.max(0, low - 1);
        const prevDiff = Math.abs((state.profileDistances[prev] || 0) - targetKm);
        const nextDiff = Math.abs((state.profileDistances[low] || 0) - targetKm);
        return prevDiff <= nextDiff ? prev : low;
      }

      function profileValueAtDistance(values, distanceKm) {
        if (!Array.isArray(values) || values.length < 2 || state.profileDistances.length !== values.length) return null;
        const targetKm = clamp(distanceKm || 0, 0, state.profileDistances[state.profileDistances.length - 1] || 0);
        let right = 1;
        while (right < state.profileDistances.length - 1 && (state.profileDistances[right] || 0) < targetKm) right += 1;
        const left = Math.max(0, right - 1);
        const fromKm = state.profileDistances[left] || 0;
        const toKm = state.profileDistances[right] || fromKm;
        const ratio = toKm > fromKm ? (targetKm - fromKm) / (toKm - fromKm) : 0;
        const fromValue = Number(values[left]);
        const toValue = Number(values[right]);
        if (!Number.isFinite(fromValue) || !Number.isFinite(toValue)) return null;
        return fromValue + (toValue - fromValue) * clamp(ratio, 0, 1);
      }

      function isPointMode() {
        return dom.routeMode && dom.routeMode.value === "point";
      }

      function isCustomMode() {
        return dom.routeMode && dom.routeMode.value === "custom";
      }

      function usesDistanceTarget() {
        return !isCustomMode();
      }

      function resetWaypointsForMode() {
        if (isCustomMode()) {
          state.waypoints = [state.start];
        } else if (isPointMode() && state.finish) {
          state.waypoints = [state.start, state.finish];
        } else {
          state.waypoints = isCustomMode() ? [state.start] : [state.start, state.start];
        }
        state.lockedWaypoints.clear();
        redrawMarkers();
      }

      function syncRouteModeControls() {
        const pointMode = isPointMode();
        const customMode = isCustomMode();
        dom.loopBtn.textContent = customMode ? "Przelicz własną trasę" : (pointMode ? "Szukaj trasy A→B" : (desiredGradeTarget() > 0 ? "Szukaj trasy z podjazdem" : "Szukaj płaskiej pętli"));
        dom.rerouteBtn.textContent = customMode ? "Przelicz własną trasę" : (pointMode ? "Przelicz A→B" : "Przelicz z punktów");
        dom.pickFinishBtn.classList.toggle("blue", state.pickingFinish);
        dom.pickStartBtn.classList.toggle("blue", state.pickingStart);
        if (dom.routePreset) dom.routePreset.disabled = customMode;
      }

      function updateRadiusCircle() {
        const areaMode = state.areaPoints.length >= 3;
        radiusCircle.setLatLng(state.start);
        radiusCircle.setRadius(Number(dom.maxRadiusKm.value) * 1000);
        radiusCircle.setStyle({
          opacity: areaMode ? 0 : 0.55,
          fillOpacity: areaMode ? 0 : 0.04
        });
      }

      function syncLabels() {
        dom.lapCount.value = getLapCount();
        dom.maxGrade.value = clamp(Number(dom.maxGrade.value) || 4, 1, 30);
        dom.targetGrade.value = clamp(Number(dom.targetGrade.value) || 0, 0, 30);
        if (Number(dom.targetGrade.value) > Number(dom.maxGrade.value)) {
          dom.maxGrade.value = dom.targetGrade.value;
        }
        dom.flatWeightOut.textContent = dom.flatWeight.value + "%";
        dom.attemptsOut.textContent = dom.attempts.value;
        dom.timeEstimateOut.textContent = formatRideTime(targetTrainingKm());
        if (dom.calorieEstimateOut) dom.calorieEstimateOut.textContent = calorieEstimate(state.stats) + " kcal";
        updatePresetDescription();
        updateRadiusCircle();
        syncRouteModeControls();
      }

      function updatePresetDescription() {
        if (isCustomMode()) {
          dom.presetDescription.textContent = "Własna trasa: presety są wyłączone, bo każdy klik i przeciągnięcie punktu ręcznie ustala przebieg. Planer liczy dystans, profil, kcal, pogodę i jakość śladu.";
          return;
        }
        const descriptions = {
          balanced: "Zbalansowany: kompromis między płaskością, asfaltem, lokalnymi drogami i sensownym dystansem.",
          scenic: "Ładna trasa: szuka spokojnego asfaltu przez wsie i okolice warte zobaczenia; premiuje atrakcje, rowerowe oznaczenia i lokalne drogi.",
          road: "Szosowo: najmocniej celuje w asfalt, drogi lokalne i brak lasu; mocno karze DK/DW oraz grunt.",
          adventure: "Przygoda: dopuszcza więcej lasu, szutru i kręcenia, ale nadal pilnuje DK i dużego ryzyka."
        };
        dom.presetDescription.textContent = descriptions[dom.routePreset.value] || descriptions.balanced;
      }

      function applyVisualTheme(theme, announce) {
        const value = ["carbon", "ember", "neon"].includes(theme) ? theme : "neon";
        document.body.classList.toggle("theme-carbon", value === "carbon");
        document.body.classList.toggle("theme-ember", value === "ember");
        document.body.dataset.theme = value;
        if (dom.themeStyle && dom.themeStyle.value !== value) dom.themeStyle.value = value;
        try {
          localStorage.setItem("planerVisualThemeV2", value);
        } catch (error) {}
        if (announce) {
          const labels = { carbon: "Motyw Carbon Pro włączony.", ember: "Motyw grafit / złoto włączony.", neon: "Motyw neonowy włączony." };
          setStatus(labels[value] || labels.neon);
        }
      }

      function restoreVisualTheme() {
        let saved = "neon";
        try {
          saved = localStorage.getItem("planerVisualThemeV2") || "neon";
        } catch (error) {}
        applyVisualTheme(saved, false);
      }
      function applyRoutePreset(preset, announce) {
        const configs = {
          balanced: {
            label: "Zbalansowany",
            flatWeight: 80,
            maxGrade: 4,
            targetGrade: 0,
            roadStrictness: 8,
            avoidNationalRoads: true,
            avoidVoivodeshipRoads: false,
            avoidForestAuto: true,
            preferAsphalt: true,
            preferBikeRoutes: true
          },
          scenic: {
            label: "Ładna trasa",
            flatWeight: 68,
            maxGrade: 7,
            targetGrade: 2,
            roadStrictness: 8,
            avoidNationalRoads: true,
            avoidVoivodeshipRoads: false,
            avoidForestAuto: true,
            preferAsphalt: true,
            preferBikeRoutes: true
          },
          road: {
            label: "Szosowo",
            flatWeight: 90,
            maxGrade: 3.5,
            targetGrade: 0,
            roadStrictness: 10,
            avoidNationalRoads: true,
            avoidVoivodeshipRoads: true,
            avoidForestAuto: true,
            preferAsphalt: true,
            preferBikeRoutes: true
          },
          adventure: {
            label: "Przygoda",
            flatWeight: 55,
            maxGrade: 12,
            targetGrade: 5,
            roadStrictness: 5,
            avoidNationalRoads: true,
            avoidVoivodeshipRoads: false,
            avoidForestAuto: false,
            preferAsphalt: false,
            preferBikeRoutes: true
          }
        };
        const config = configs[preset] || configs.balanced;
        dom.flatWeight.value = config.flatWeight;
        dom.maxGrade.value = config.maxGrade;
        dom.targetGrade.value = config.targetGrade;
        dom.roadStrictness.value = config.roadStrictness;
        dom.avoidNationalRoads.checked = config.avoidNationalRoads;
        dom.avoidVoivodeshipRoads.checked = config.avoidVoivodeshipRoads;
        dom.avoidForestAuto.checked = config.avoidForestAuto;
        dom.preferAsphalt.checked = config.preferAsphalt;
        dom.preferBikeRoutes.checked = config.preferBikeRoutes;
        syncLabels();
        updateMetrics(state.stats, "OSRM");
        if (announce) {
          markRouteRulesChanged("Tryb trasy: " + config.label + ". Stara trasa została odpięta od mapy.");
        }
      }

      function toRad(value) {
        return value * Math.PI / 180;
      }

      function toDeg(value) {
        return value * 180 / Math.PI;
      }

      function haversineKm(a, b) {
        const lat1 = toRad(a.lat);
        const lat2 = toRad(b.lat);
        const dLat = toRad(b.lat - a.lat);
        const dLng = toRad(b.lng - a.lng);
        const s = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
        return earthKm * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
      }

      function xyToLatLng(xKm, yKm, origin) {
        const lat = toRad(origin.lat) + yKm / earthKm;
        const lng = toRad(origin.lng) + xKm / (earthKm * Math.cos(toRad(origin.lat)));
        return L.latLng(toDeg(lat), toDeg(lng));
      }

      function latLngToXy(latlng, origin) {
        const x = earthKm * toRad(latlng.lng - origin.lng) * Math.cos(toRad(origin.lat));
        const y = earthKm * toRad(latlng.lat - origin.lat);
        return { x, y };
      }

      function rotatePoint(point, angleDeg) {
        const angle = toRad(angleDeg);
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        return {
          x: point.x * c - point.y * s,
          y: point.x * s + point.y * c
        };
      }

      function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
      }

      function sleep(ms) {
        return new Promise((resolve) => window.setTimeout(resolve, ms));
      }

      async function mapConcurrent(items, limit, worker) {
        const output = [];
        let cursor = 0;
        const workerCount = Math.min(Math.max(1, limit), items.length);
        const runners = Array.from({ length: workerCount }, async () => {
          while (cursor < items.length) {
            const index = cursor;
            cursor += 1;
            const value = await worker(items[index], index);
            if (value != null) output.push(value);
          }
        });
        await Promise.all(runners);
        return output;
      }

      function estimateRouteSeconds(attempts, withOsm) {
        const routing = Math.ceil(Math.max(1, attempts) * 4 / candidateRouteConcurrency);
        const osm = withOsm ? Math.ceil(Math.min(Math.max(1, attempts), finalistAnalyzeLimit) * 5 / osmAnalysisConcurrency) : 0;
        return routing + osm + 5;
      }

      async function fetchJson(url, timeoutMs) {
        const controller = new AbortController();
        const timer = window.setTimeout(() => controller.abort(), timeoutMs || 25000);
        try {
          const response = await fetch(url, { signal: controller.signal });
          if (!response.ok) {
            throw new Error("HTTP " + response.status);
          }
          return await response.json();
        } finally {
          window.clearTimeout(timer);
        }
      }

      function waitMs(ms) {
        return new Promise((resolve) => window.setTimeout(resolve, ms));
      }

      async function fetchJsonRetry(url, timeoutMs, retries, pauseMs) {
        let lastError = null;
        for (let attempt = 0; attempt <= (retries || 0); attempt += 1) {
          try {
            return await fetchJson(url, timeoutMs);
          } catch (error) {
            lastError = error;
            if (attempt < (retries || 0)) await waitMs(pauseMs || 900);
          }
        }
        throw lastError || new Error("Nieudane pobranie danych.");
      }

      function readableAddressFromNominatim(data) {
        const address = data && data.address ? data.address : {};
        const city = address.city || address.town || address.village || address.municipality || address.county || "";
        const road = address.road || address.pedestrian || address.cycleway || address.footway || "";
        const house = address.house_number || "";
        const street = [road, house].filter(Boolean).join(" ");
        const parts = [city, street, address.postcode || "", address.country || ""].filter(Boolean);
        return parts.length >= 2 ? parts.join(", ") : (data && data.display_name ? data.display_name : "");
      }

      async function reverseGeocodeLatLng(latlng) {
        const url = "https://nominatim.openstreetmap.org/reverse?format=jsonv2&accept-language=pl&addressdetails=1&zoom=18&lat="
          + encodeURIComponent(latlng.lat.toFixed(7))
          + "&lon="
          + encodeURIComponent(latlng.lng.toFixed(7));
        const data = await fetchJson(url, 18000);
        return readableAddressFromNominatim(data);
      }

      async function postJson(url, payload, timeoutMs) {
        const controller = new AbortController();
        const timer = window.setTimeout(() => controller.abort(), timeoutMs || 25000);
        try {
          const response = await fetch(url, {
            method: "POST",
            signal: controller.signal,
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
          });
          if (!response.ok) {
            throw new Error("HTTP " + response.status);
          }
          return await response.json();
        } finally {
          window.clearTimeout(timer);
        }
      }

      async function postJsonRetry(url, payload, timeoutMs, retries, pauseMs) {
        let lastError = null;
        for (let attempt = 0; attempt <= (retries || 0); attempt += 1) {
          try {
            return await postJson(url, payload, timeoutMs);
          } catch (error) {
            lastError = error;
            if (attempt < (retries || 0)) await waitMs(pauseMs || 900);
          }
        }
        throw lastError || new Error("Nieudane pobranie danych.");
      }

      async function fetchOverpass(query, options) {
        const fast = options && options.fast;
        const timeoutMs = (options && options.timeoutMs) || (fast ? 11000 : 18000);
        const endpoints = fast ? overpassEndpoints.slice(0, 2) : overpassEndpoints;
        let lastError = null;
        for (const endpoint of endpoints) {
          const controller = new AbortController();
          const timer = window.setTimeout(() => controller.abort(), timeoutMs);
          try {
            const response = await fetch(endpoint, {
              method: "POST",
              signal: controller.signal,
              headers: {
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
              },
              body: "data=" + encodeURIComponent(query)
            });
            if (!response.ok) {
              throw new Error("HTTP " + response.status);
            }
            return await response.json();
          } catch (error) {
            lastError = error;
          } finally {
            window.clearTimeout(timer);
          }
        }
        throw lastError || new Error("Overpass nie odpowiedział.");
      }

      function escapeHtml(value) {
        return String(value == null ? "" : value)
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;");
      }

      function shopTypeLabel(type) {
        const labels = {
          supermarket: "supermarket",
          convenience: "spożywczy",
          grocery: "spożywczy",
          greengrocer: "warzywniak",
          bakery: "piekarnia",
          deli: "delikatesy",
          general: "sklep",
          kiosk: "kiosk"
        };
        return labels[type] || "sklep";
      }

      function foodShopIcon() {
        return L.divIcon({
          className: "",
          html: '<span class="shop-marker">SK</span>',
          iconSize: [25, 25],
          iconAnchor: [13, 13],
          popupAnchor: [0, -13]
        });
      }

      function foodShopQuery(bounds) {
        const south = bounds.getSouth().toFixed(6);
        const west = bounds.getWest().toFixed(6);
        const north = bounds.getNorth().toFixed(6);
        const east = bounds.getEast().toFixed(6);
        const bbox = south + "," + west + "," + north + "," + east;
        const shopPattern = "^(supermarket|convenience|grocery|greengrocer|bakery|deli|general|kiosk|beverages|butcher|confectionery|pastry|farm)$";
        return [
          "[out:json][timeout:22];",
          "(",
          'node["shop"~"' + shopPattern + '"](' + bbox + ");",
          'way["shop"~"' + shopPattern + '"](' + bbox + ");",
          'relation["shop"~"' + shopPattern + '"](' + bbox + ");",
          ");",
          "out body center 180;"
        ].join("\n");
      }

      function foodShopAroundQuery(center, radiusMeters) {
        const lat = center.lat.toFixed(6);
        const lng = center.lng.toFixed(6);
        const radius = Math.round(clamp(radiusMeters || 18000, 3000, 32000));
        const shopPattern = "^(supermarket|convenience|grocery|greengrocer|bakery|deli|general|kiosk|beverages|butcher|confectionery|pastry|farm)$";
        return [
          "[out:json][timeout:22];",
          "(",
          'node["shop"~"' + shopPattern + '"](around:' + radius + "," + lat + "," + lng + ");",
          'way["shop"~"' + shopPattern + '"](around:' + radius + "," + lat + "," + lng + ");",
          'relation["shop"~"' + shopPattern + '"](around:' + radius + "," + lat + "," + lng + ");",
          ");",
          "out body center 220;"
        ].join("\n");
      }

      function drawFoodShops(elements) {
        foodShopLayer.clearLayers();
        const seen = new Set();
        const shops = [];
        for (const element of elements || []) {
          const lat = Number(element.lat != null ? element.lat : element.center && element.center.lat);
          const lng = Number(element.lon != null ? element.lon : element.center && element.center.lon);
          if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;
          const tags = element.tags || {};
          const key = element.type + ":" + element.id;
          if (seen.has(key)) continue;
          seen.add(key);
          shops.push({ latlng: L.latLng(lat, lng), tags });
        }
        shops.slice(0, 180).forEach((shop) => {
          const tags = shop.tags || {};
          const name = tags.name || tags.brand || shopTypeLabel(tags.shop);
          const details = [
            shopTypeLabel(tags.shop),
            tags.opening_hours ? "godziny: " + tags.opening_hours : "",
            tags["addr:street"] ? tags["addr:street"] + (tags["addr:housenumber"] ? " " + tags["addr:housenumber"] : "") : ""
          ].filter(Boolean);
          L.marker(shop.latlng, {
            icon: foodShopIcon(),
            pane: "shopsPane",
            title: name
          })
            .bindPopup('<div class="shop-popup"><strong>' + escapeHtml(name) + '</strong>' + escapeHtml(details.join(" | ")) + "</div>", { className: "dark-route-popup" })
            .addTo(foodShopLayer);
        });
        return shops.length;
      }

      function currentShopBoundsKey(bounds) {
        return [
          map.getZoom(),
          bounds.getSouth().toFixed(4),
          bounds.getWest().toFixed(4),
          bounds.getNorth().toFixed(4),
          bounds.getEast().toFixed(4)
        ].join("|");
      }

      async function refreshFoodShops(force) {
        if (!dom.showFoodShops || !dom.showFoodShops.checked) {
          foodShopLayer.clearLayers();
          state.shopCacheKey = "";
          return;
        }
        const bounds = map.getBounds();
        const diagonalKm = haversineKm(bounds.getSouthWest(), bounds.getNorthEast());
        const useAroundFallback = map.getZoom() < 10 || diagonalKm > 95;
        const key = currentShopBoundsKey(bounds);
        if (!force && key === state.shopCacheKey) return;
        const requestId = ++state.shopRequestId;
        try {
          setStatus(useAroundFallback ? "Mapa jest mocno oddalona, szukam sklepów wokół środka widoku..." : "Pobieram sklepy spożywcze z OpenStreetMap...");
          const query = useAroundFallback
            ? foodShopAroundQuery(map.getCenter(), Math.min(32000, Math.max(8000, diagonalKm * 500)))
            : foodShopQuery(bounds);
          let data = await fetchOverpass(query, { fast: true, timeoutMs: 15000 });
          if (requestId !== state.shopRequestId) return;
          let count = drawFoodShops(data.elements || []);
          if (!count && !useAroundFallback) {
            setStatus("W tym widoku Overpass zwrócił 0 sklepów, próbuję szukać wokół środka mapy...", "warn");
            data = await fetchOverpass(foodShopAroundQuery(map.getCenter(), 18000), { fast: true, timeoutMs: 9000 });
            if (requestId !== state.shopRequestId) return;
            count = drawFoodShops(data.elements || []);
          }
          state.shopCacheKey = key;
          setStatus(count
            ? "Sklepy na mapie: " + count + ". Po przesunięciu mapy odświeżę punkty automatycznie."
            : "Sklepy: 0 w tym obszarze. Przybliż mapę do miejscowości albo przesuń widok i kliknij Pokaż sklepy jeszcze raz.",
            count ? "" : "warn");
        } catch (error) {
          if (requestId !== state.shopRequestId) return;
          state.shopCacheKey = "";
          setStatus("Nie udało się pobrać sklepów z Overpass: " + error.message, "warn");
        }
      }

      function scheduleFoodShopRefresh() {
        if (!dom.showFoodShops || !dom.showFoodShops.checked) return;
        window.clearTimeout(state.shopRefreshTimerId);
        state.shopRefreshTimerId = window.setTimeout(() => refreshFoodShops(false), 700);
      }

      function toggleFoodShops() {
        state.shopRequestId += 1;
        window.clearTimeout(state.shopRefreshTimerId);
        syncFoodShopButtons();
      syncAttractionButtons();
        if (!dom.showFoodShops.checked) {
          foodShopLayer.clearLayers();
          state.shopCacheKey = "";
          setStatus("Sklepy spożywcze ukryte.");
          return;
        }
        refreshFoodShops(true);
      }

      function syncFoodShopButtons() {
        if (!dom.quickShopsBtn || !dom.showFoodShops) return;
        const enabled = !!dom.showFoodShops.checked;
        dom.quickShopsBtn.textContent = enabled ? "Ukryj sklepy" : "Pokaż sklepy";
        dom.quickShopsBtn.classList.toggle("active", enabled);
        dom.quickShopsBtn.setAttribute("aria-pressed", enabled ? "true" : "false");
      }

      function toggleFoodShopsFromMap() {
        dom.showFoodShops.checked = !dom.showFoodShops.checked;
        toggleFoodShops();
      }


      function attractionTypeLabel(tags) {
        if (!tags) return "atrakcja";
        if (tags.tourism === "attraction") return "atrakcja";
        if (tags.tourism === "viewpoint") return "punkt widokowy";
        if (tags.tourism === "museum") return "muzeum";
        if (tags.tourism === "gallery") return "galeria";
        if (tags.tourism === "artwork") return "sztuka / pomnik";
        if (tags.tourism === "picnic_site") return "miejsce odpoczynku";
        if (tags.tourism === "information") return tags.information === "map" ? "mapa turystyczna" : "informacja turystyczna";
        if (tags.historic === "castle") return "zamek";
        if (tags.historic === "ruins") return "ruiny";
        if (tags.historic === "monument") return "pomnik";
        if (tags.historic === "memorial") return "miejsce pamięci";
        if (tags.historic === "archaeological_site") return "stanowisko archeologiczne";
        if (tags.historic === "wayside_cross") return "krzyż przydrożny";
        if (tags.historic === "wayside_shrine") return "kapliczka";
        if (tags.historic) return "zabytek / historia";
        if (tags.amenity === "place_of_worship") return "kościół / obiekt sakralny";
        if (tags.amenity === "fountain") return "fontanna";
        if (tags.natural === "peak") return "szczyt";
        if (tags.natural === "spring") return "źródło";
        if (tags.natural === "cave_entrance") return "jaskinia";
        if (tags.leisure === "park") return "park";
        if (tags.leisure === "nature_reserve") return "rezerwat / natura";
        if (tags.man_made === "tower") return "wieża";
        if (tags.man_made === "water_tower") return "wieża ciśnień";
        return tags.tourism || tags.historic || tags.amenity || tags.natural || tags.leisure || tags.man_made || "ciekawe miejsce";
      }

      function attractionIcon() {
        return L.divIcon({
          className: "",
          html: '<span class="attraction-marker">AT</span>',
          iconSize: [28, 28],
          iconAnchor: [14, 14],
          popupAnchor: [0, -12]
        });
      }

      function attractionQuery(bounds) {
        const bbox = [bounds.getSouth(), bounds.getWest(), bounds.getNorth(), bounds.getEast()].map((value) => value.toFixed(6)).join(",");
        const tourismPattern = "^(attraction|viewpoint|museum|gallery|artwork|picnic_site|information)$";
        const historicPattern = "^(castle|ruins|monument|memorial|archaeological_site|wayside_cross|wayside_shrine|fort|tower)$";
        const amenityPattern = "^(place_of_worship|fountain)$";
        const naturalPattern = "^(peak|spring|cave_entrance)$";
        const manMadePattern = "^(tower|water_tower|lighthouse)$";
        return [
          "[out:json][timeout:9];",
          "(",
          'node["tourism"~"' + tourismPattern + '"](' + bbox + ");",
          'node["historic"~"' + historicPattern + '"](' + bbox + ");",
          'node["amenity"~"' + amenityPattern + '"](' + bbox + ");",
          'node["natural"~"' + naturalPattern + '"](' + bbox + ");",
          'node["leisure"="park"](' + bbox + ");",
          'node["man_made"~"' + manMadePattern + '"](' + bbox + ");",
          ");",
          "out body 160;"
        ].join("\n");
      }

      function attractionAroundQuery(center, radiusMeters) {
        const lat = center.lat.toFixed(6);
        const lng = center.lng.toFixed(6);
        const radius = Math.round(clamp(radiusMeters || 9000, 1800, 14000));
        const tourismPattern = "^(attraction|viewpoint|museum|gallery|artwork|picnic_site|information)$";
        const historicPattern = "^(castle|ruins|monument|memorial|archaeological_site|wayside_cross|wayside_shrine|fort|tower)$";
        const amenityPattern = "^(place_of_worship|fountain)$";
        const naturalPattern = "^(peak|spring|cave_entrance)$";
        const manMadePattern = "^(tower|water_tower|lighthouse)$";
        return [
          "[out:json][timeout:9];",
          "(",
          'node["tourism"~"' + tourismPattern + '"](around:' + radius + "," + lat + "," + lng + ");",
          'node["historic"~"' + historicPattern + '"](around:' + radius + "," + lat + "," + lng + ");",
          'node["amenity"~"' + amenityPattern + '"](around:' + radius + "," + lat + "," + lng + ");",
          'node["natural"~"' + naturalPattern + '"](around:' + radius + "," + lat + "," + lng + ");",
          'node["leisure"="park"](around:' + radius + "," + lat + "," + lng + ");",
          'node["man_made"~"' + manMadePattern + '"](around:' + radius + "," + lat + "," + lng + ");",
          ");",
          "out body 160;"
        ].join("\n");
      }

      function attractionPriorityAroundQuery(center, radiusMeters) {
        const lat = center.lat.toFixed(6);
        const lng = center.lng.toFixed(6);
        const radius = Math.round(clamp(radiusMeters || 6000, 1500, 9000));
        return [
          "[out:json][timeout:7];",
          "(",
          'node["tourism"~"^(attraction|viewpoint|museum)$"](around:' + radius + "," + lat + "," + lng + ");",
          'node["historic"~"^(castle|ruins|monument|memorial)$"](around:' + radius + "," + lat + "," + lng + ");",
          'node["amenity"="place_of_worship"](around:' + radius + "," + lat + "," + lng + ");",
          ");",
          "out body 100;"
        ].join("\n");
      }
      function drawAttractions(elements) {
        attractionLayer.clearLayers();
        const seen = new Set();
        const attractions = [];
        for (const element of elements || []) {
          const lat = Number(element.lat != null ? element.lat : element.center && element.center.lat);
          const lng = Number(element.lon != null ? element.lon : element.center && element.center.lon);
          if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;
          const tags = element.tags || {};
          const label = attractionTypeLabel(tags);
          const name = tags["name:pl"] || tags.name || tags.alt_name || label;
          const key = (name || "").toLowerCase().trim() + "|" + lat.toFixed(4) + "," + lng.toFixed(4);
          if (seen.has(key)) continue;
          seen.add(key);
          attractions.push({ latlng: L.latLng(lat, lng), tags, name, label });
        }
        attractions.slice(0, 120).forEach((item) => {
          const details = [
            item.label,
            item.tags.wikipedia ? "Wikipedia" : "",
            item.tags.website ? "strona www" : ""
          ].filter(Boolean);
          L.marker(item.latlng, {
            icon: attractionIcon(),
            pane: "attractionsPane",
            title: item.name
          })
            .bindPopup('<div class="shop-popup attraction-popup"><strong>' + escapeHtml(item.name) + '</strong>' + escapeHtml(details.join(" | ")) + "</div>", { className: "dark-route-popup" })
            .addTo(attractionLayer);
        });
        return attractions.length;
      }

      function currentAttractionBoundsKey(bounds) {
        return [
          map.getZoom(),
          bounds.getSouth().toFixed(4),
          bounds.getWest().toFixed(4),
          bounds.getNorth().toFixed(4),
          bounds.getEast().toFixed(4)
        ].join("|");
      }

      async function refreshAttractions(force) {
        if (!dom.showAttractions || !dom.showAttractions.checked) {
          attractionLayer.clearLayers();
          state.attractionCacheKey = "";
          return;
        }
        const bounds = map.getBounds();
        const diagonalKm = haversineKm(bounds.getSouthWest(), bounds.getNorthEast());
        const useAroundFallback = map.getZoom() < 12 || diagonalKm > 35;
        const key = currentAttractionBoundsKey(bounds);
        if (!force && key === state.attractionCacheKey) return;
        const requestId = ++state.attractionRequestId;
        try {
          setStatus(useAroundFallback ? "Mapa jest mocno oddalona, szukam atrakcji wokół środka widoku..." : "Pobieram atrakcje i ciekawe miejsca z OpenStreetMap...");
          const query = useAroundFallback
            ? attractionAroundQuery(map.getCenter(), Math.min(12000, Math.max(4500, diagonalKm * 260)))
            : attractionQuery(bounds);
          let data = await fetchOverpass(query, { fast: true, timeoutMs: 15000 });
          if (requestId !== state.attractionRequestId) return;
          let count = drawAttractions(data.elements || []);
          if (!count && !useAroundFallback) {
            setStatus("W tym widoku Overpass zwrócił 0 atrakcji, próbuję szukać wokół środka mapy...", "warn");
            data = await fetchOverpass(attractionAroundQuery(map.getCenter(), 9000), { fast: true, timeoutMs: 15000 });
            if (requestId !== state.attractionRequestId) return;
            count = drawAttractions(data.elements || []);
          }
          state.attractionCacheKey = key;
          setStatus(count
            ? "Atrakcje na mapie: " + count + " z OSM. Kliknij marker AT, żeby zobaczyć nazwę i typ miejsca."
            : "Atrakcje: 0 z OSM w tym widoku. Przybliż/oddal mapę albo przesuń widok i kliknij Atrakcje w widoku jeszcze raz.",
            count ? "" : "warn");
        } catch (error) {
          if (requestId !== state.attractionRequestId) return;
          state.attractionCacheKey = "";
          try {
            setStatus("Overpass przerwał duże zapytanie. Próbuję małego zakresu atrakcji wokół środka mapy...", "warn");
            const fallback = await fetchOverpass(attractionPriorityAroundQuery(map.getCenter(), 6500), { fast: false, timeoutMs: 18000 });
            if (requestId !== state.attractionRequestId) return;
            const fallbackCount = drawAttractions(fallback.elements || []);
            state.attractionCacheKey = currentAttractionBoundsKey(map.getBounds()) + "|fallback";
            setStatus(fallbackCount ? "Atrakcje na mapie: " + fallbackCount + " z małego zakresu OSM." : "Atrakcje: 0 z OSM w małym zakresie. Spróbuj przybliżyć mapę lub przesunąć widok.", fallbackCount ? "" : "warn");
          } catch (fallbackError) {
            setStatus("Nie udało się pobrać atrakcji z Overpass. Serwer OSM nie odpowiedział w czasie; przybliż mapę i spróbuj ponownie.", "warn");
          }
        }
      }

      function scheduleAttractionRefresh() {
        if (!dom.showAttractions || !dom.showAttractions.checked) return;
        window.clearTimeout(state.attractionRefreshTimerId);
        state.attractionRefreshTimerId = window.setTimeout(() => refreshAttractions(false), 900);
      }

      function syncAttractionButtons() {
        if (!dom.showAttractions) return;
        const enabled = !!dom.showAttractions.checked;
        for (const button of [dom.quickAttractionsBtn, dom.fullscreenAttractionsBtn]) {
          if (!button) continue;
          button.textContent = enabled ? "Ukryj atrakcje" : (button === dom.fullscreenAttractionsBtn ? "Atrakcje" : "Atrakcje w widoku");
          button.classList.toggle("active", enabled);
          button.setAttribute("aria-pressed", enabled ? "true" : "false");
        }
      }

      function toggleAttractions() {
        if (!dom.showAttractions) return;
        state.attractionRequestId += 1;
        window.clearTimeout(state.attractionRefreshTimerId);
        syncAttractionButtons();
        if (!dom.showAttractions.checked) {
          attractionLayer.clearLayers();
          state.attractionCacheKey = "";
          setStatus("Atrakcje ukryte.");
          return;
        }
        refreshAttractions(true);
      }

      function toggleAttractionsFromMap() {
        if (!dom.showAttractions) return;
        dom.showAttractions.checked = !dom.showAttractions.checked;
        toggleAttractions();
      }

      function routeShopQuery(route, radiusMeters) {
        const samples = sampleRoute(route, Math.min(10, Math.max(4, Math.round(routeDistanceKm(route) / 18))));
        const radius = Math.round(clamp(radiusMeters || 700, 250, 900));
        const path = samples.map((point) => point.lat.toFixed(6) + "," + point.lng.toFixed(6)).join(",");
        const shopPattern = "^(supermarket|convenience|grocery|greengrocer|bakery|deli|general|kiosk|beverages|butcher|confectionery|pastry)$";
        return [
          "[out:json][timeout:8];",
          "(",
          'node["shop"~"' + shopPattern + '"](around:' + radius + "," + path + ");",
          ");",
          "out body 90;"
        ].join("\n");
      }

      function routeShopQueryChunk(route, startRatio, endRatio, radiusMeters) {
        const start = clamp(startRatio, 0, 1);
        const end = clamp(endRatio, start, 1);
        const sampleCount = Math.max(4, Math.round((end - start) * 12));
        const fullSamples = sampleRoute(route, 52);
        const fromIndex = Math.floor(start * Math.max(1, fullSamples.length - 1));
        const toIndex = Math.max(fromIndex + 1, Math.ceil(end * Math.max(1, fullSamples.length - 1)));
        const chunk = sampleRoute(fullSamples.slice(fromIndex, toIndex + 1), sampleCount);
        const radius = Math.round(clamp(radiusMeters || 700, 250, 900));
        const path = chunk.map((point) => point.lat.toFixed(6) + "," + point.lng.toFixed(6)).join(",");
        const shopPattern = "^(supermarket|convenience|grocery|greengrocer|bakery|deli|general|kiosk|beverages|butcher|confectionery|pastry)$";
        return [
          "[out:json][timeout:8];",
          "(",
          'node["shop"~"' + shopPattern + '"](around:' + radius + "," + path + ");",
          ");",
          "out body 70;"
        ].join("\n");
      }

      function routeShopPriorityQuery(route, startRatio, endRatio, radiusMeters) {
        const start = clamp(startRatio || 0, 0, 1);
        const end = clamp(endRatio == null ? 1 : endRatio, start, 1);
        const fullSamples = sampleRoute(route, 34);
        const fromIndex = Math.floor(start * Math.max(1, fullSamples.length - 1));
        const toIndex = Math.max(fromIndex + 1, Math.ceil(end * Math.max(1, fullSamples.length - 1)));
        const chunk = sampleRoute(fullSamples.slice(fromIndex, toIndex + 1), 4);
        const radius = Math.round(clamp(radiusMeters || 650, 250, 850));
        const path = chunk.map((point) => point.lat.toFixed(6) + "," + point.lng.toFixed(6)).join(",");
        return [
          "[out:json][timeout:10];",
          "(",
          'node["shop"~"^(supermarket|convenience|grocery|bakery)$"](around:' + radius + "," + path + ");",
          ");",
          "out body 50;"
        ].join("\n");
      }

      function routeShopAroundPointQuery(point, radiusMeters) {
        const radius = Math.round(clamp(radiusMeters || 5500, 1000, 12000));
        return [
          "[out:json][timeout:10];",
          "(",
          'node["shop"~"^(supermarket|convenience|grocery|bakery)$"](around:' + radius + "," + point.lat.toFixed(6) + "," + point.lng.toFixed(6) + ");",
          ");",
          "out body 50;"
        ].join("\n");
      }

      function routeDistanceContext(point) {
        const route = state.profileLatLngs.length >= 2 ? state.profileLatLngs : sampleRoute(state.routeLatLngs, 180);
        if (!route.length) return { distanceFromRouteKm: Infinity, distanceAlongKm: 0 };
        const distances = routeSampleDistances(route);
        let bestIndex = 0;
        let bestDistanceKm = Infinity;
        for (let i = 0; i < route.length; i += 1) {
          const distanceKm = haversineKm(point, route[i]);
          if (distanceKm < bestDistanceKm) {
            bestDistanceKm = distanceKm;
            bestIndex = i;
          }
        }
        return {
          distanceFromRouteKm: bestDistanceKm,
          distanceAlongKm: distances[bestIndex] || 0
        };
      }

      function shopsFromOverpassElements(elements, maxDistanceKm) {
        const seen = new Set();
        const shops = [];
        for (const element of elements || []) {
          const lat = Number(element.lat != null ? element.lat : element.center && element.center.lat);
          const lng = Number(element.lon != null ? element.lon : element.center && element.center.lon);
          if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;
          const tags = element.tags || {};
          const key = element.type + ":" + element.id;
          if (seen.has(key)) continue;
          seen.add(key);
          const latlng = L.latLng(lat, lng);
          const context = routeDistanceContext(latlng);
          if (context.distanceFromRouteKm > maxDistanceKm) continue;
          shops.push({
            latlng,
            tags,
            name: tags.name || tags.brand || shopTypeLabel(tags.shop),
            type: shopTypeLabel(tags.shop),
            distanceFromRouteKm: context.distanceFromRouteKm,
            distanceAlongKm: context.distanceAlongKm
          });
        }
        shops.sort((a, b) => a.distanceAlongKm - b.distanceAlongKm || a.distanceFromRouteKm - b.distanceFromRouteKm);
        return shops.slice(0, 60);
      }

      function mergeRouteShops(existing, incoming, maxDistanceKm) {
        const byKey = new Map();
        for (const shop of (existing || []).concat(incoming || [])) {
          const nameKey = (shop.name || "").toLowerCase().replace(/\s+/g, " ").trim();
          const coordKey = shop.latlng.lat.toFixed(4) + "," + shop.latlng.lng.toFixed(4);
          const key = nameKey || coordKey;
          if ((shop.distanceFromRouteKm || 0) > maxDistanceKm) continue;
          const previous = byKey.get(key);
          if (!previous || shop.distanceFromRouteKm < previous.distanceFromRouteKm) {
            byKey.set(key, shop);
          }
        }
        return Array.from(byKey.values())
          .sort((a, b) => a.distanceAlongKm - b.distanceAlongKm || a.distanceFromRouteKm - b.distanceFromRouteKm)
          .slice(0, 80);
      }

      function drawRouteFoodShops(shops) {
        routeFoodShopLayer.clearLayers();
        for (const shop of shops || []) {
          const details = [
            "km " + shop.distanceAlongKm.toFixed(1),
            (shop.distanceFromRouteKm * 1000).toFixed(0) + " m od trasy",
            shop.type
          ];
          L.marker(shop.latlng, {
            icon: foodShopIcon(),
            pane: "shopsPane",
            title: shop.name
          })
            .bindPopup('<div class="shop-popup"><strong>' + escapeHtml(shop.name) + '</strong>' + escapeHtml(details.join(" | ")) + "</div>", { className: "dark-route-popup" })
            .addTo(routeFoodShopLayer);
        }
      }



      function routeAttractionQuery(route, radiusMeters) {
        const totalKm = routeDistanceKm(route);
        const samples = sampleRoute(route, Math.min(16, Math.max(6, Math.round(totalKm / 12))));
        const radius = Math.round(clamp(radiusMeters || 950, 350, 1400));
        const path = samples.map((point) => point.lat.toFixed(6) + "," + point.lng.toFixed(6)).join(",");
        const tourismPattern = "^(attraction|viewpoint|museum|gallery|artwork|picnic_site|information)$";
        const historicPattern = "^(castle|ruins|monument|memorial|archaeological_site|wayside_cross|wayside_shrine|fort|tower)$";
        const amenityPattern = "^(place_of_worship|fountain)$";
        const naturalPattern = "^(peak|spring|cave_entrance)$";
        const manMadePattern = "^(tower|water_tower|lighthouse)$";
        return [
          "[out:json][timeout:10];",
          "(",
          'node["tourism"~"' + tourismPattern + '"](around:' + radius + "," + path + ");",
          'node["historic"~"' + historicPattern + '"](around:' + radius + "," + path + ");",
          'node["amenity"~"' + amenityPattern + '"](around:' + radius + "," + path + ");",
          'node["natural"~"' + naturalPattern + '"](around:' + radius + "," + path + ");",
          'node["leisure"="park"](around:' + radius + "," + path + ");",
          'node["man_made"~"' + manMadePattern + '"](around:' + radius + "," + path + ");",
          ");",
          "out body 140;"
        ].join("\n");
      }

      function routeAttractionQueryChunk(route, startRatio, endRatio, radiusMeters) {
        const start = clamp(startRatio, 0, 1);
        const end = clamp(endRatio, start, 1);
        const fullSamples = sampleRoute(route, 64);
        const fromIndex = Math.floor(start * Math.max(1, fullSamples.length - 1));
        const toIndex = Math.max(fromIndex + 1, Math.ceil(end * Math.max(1, fullSamples.length - 1)));
        const chunk = sampleRoute(fullSamples.slice(fromIndex, toIndex + 1), Math.max(5, Math.round((end - start) * 12)));
        return routeAttractionQuery(chunk, radiusMeters || 950).replace("out body 140;", "out body 100;");
      }

      function attractionsFromOverpassElements(elements, maxDistanceKm) {
        const seen = new Set();
        const attractions = [];
        for (const element of elements || []) {
          const lat = Number(element.lat != null ? element.lat : element.center && element.center.lat);
          const lng = Number(element.lon != null ? element.lon : element.center && element.center.lon);
          if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;
          const tags = element.tags || {};
          const label = attractionTypeLabel(tags);
          const name = tags["name:pl"] || tags.name || tags.alt_name || label;
          const key = (name || "").toLowerCase().replace(/\s+/g, " ").trim() + "|" + lat.toFixed(4) + "," + lng.toFixed(4);
          if (seen.has(key)) continue;
          seen.add(key);
          const latlng = L.latLng(lat, lng);
          const context = routeDistanceContext(latlng);
          if (context.distanceFromRouteKm > maxDistanceKm) continue;
          attractions.push({
            latlng,
            tags,
            name,
            type: label,
            distanceFromRouteKm: context.distanceFromRouteKm,
            distanceAlongKm: context.distanceAlongKm
          });
        }
        attractions.sort((a, b) => a.distanceAlongKm - b.distanceAlongKm || a.distanceFromRouteKm - b.distanceFromRouteKm);
        return attractions.slice(0, 70);
      }

      function mergeRouteAttractions(existing, incoming, maxDistanceKm) {
        const byKey = new Map();
        for (const item of (existing || []).concat(incoming || [])) {
          const nameKey = (item.name || "").toLowerCase().replace(/\s+/g, " ").trim();
          const coordKey = item.latlng.lat.toFixed(4) + "," + item.latlng.lng.toFixed(4);
          const key = nameKey || coordKey;
          if ((item.distanceFromRouteKm || 0) > maxDistanceKm) continue;
          const previous = byKey.get(key);
          if (!previous || item.distanceFromRouteKm < previous.distanceFromRouteKm) byKey.set(key, item);
        }
        return Array.from(byKey.values())
          .sort((a, b) => a.distanceAlongKm - b.distanceAlongKm || a.distanceFromRouteKm - b.distanceFromRouteKm)
          .slice(0, 80);
      }

      function drawRouteAttractions(attractions) {
        routeAttractionLayer.clearLayers();
        for (const item of attractions || []) {
          const details = [
            "km " + item.distanceAlongKm.toFixed(1),
            Math.round(item.distanceFromRouteKm * 1000) + " m od trasy",
            item.type
          ];
          L.marker(item.latlng, {
            icon: attractionIcon(),
            pane: "attractionsPane",
            title: item.name
          })
            .bindPopup('<div class="shop-popup attraction-popup"><strong>' + escapeHtml(item.name) + '</strong>' + escapeHtml(details.join(" | ")) + "</div>", { className: "dark-route-popup" })
            .addTo(routeAttractionLayer);
        }
      }

      function plannedBreakDistanceKm() {
        const value = Number(dom.breakEveryKm && dom.breakEveryKm.value);
        return Number.isFinite(value) ? clamp(value, 0, 200) : 0;
      }

      function drawPlannedBreaks() {
        plannedBreakLayer.clearLayers();
        const everyKm = plannedBreakDistanceKm();
        const totalKm = state.stats && state.stats.distanceKm ? state.stats.distanceKm : routeDistanceKm(state.routeLatLngs);
        if (!state.routeLatLngs.length || !everyKm || totalKm <= everyKm * 0.75) return;
        let index = 1;
        for (let distanceKm = everyKm; distanceKm < totalKm - 0.25; distanceKm += everyKm) {
          const routePoint = routePointAtDistance(state.routeLatLngs, distanceKm);
          if (!routePoint || !routePoint.point) continue;
          L.marker(routePoint.point, {
            pane: "shopsPane",
            interactive: true,
            icon: L.divIcon({
              className: "",
              html: '<div class="break-marker">P' + index + "</div>",
              iconSize: [31, 31],
              iconAnchor: [15, 44]
            })
          }).bindPopup(
            '<div class="break-popup"><strong>Planowana przerwa P' + index + '</strong>' +
            'około km ' + distanceKm.toFixed(1) +
            '<br>Symulacja: co ' + everyKm.toFixed(0) + ' km' +
            '<br>Do końca: ' + Math.max(0, totalKm - distanceKm).toFixed(1) + ' km</div>'
          , { className: "dark-route-popup" }).addTo(plannedBreakLayer);
          index += 1;
          if (index > 80) break;
        }
      }

      function routeShopGaps(shops, totalKm) {
        if (!totalKm || !shops.length) return [];
        const stops = [{ distanceAlongKm: 0 }].concat(shops).concat([{ distanceAlongKm: totalKm }]);
        const gaps = [];
        for (let i = 1; i < stops.length; i += 1) {
          const gap = Math.max(0, stops[i].distanceAlongKm - stops[i - 1].distanceAlongKm);
          if (gap >= 20) {
            gaps.push({
              fromKm: stops[i - 1].distanceAlongKm,
              toKm: stops[i].distanceAlongKm,
              gapKm: gap
            });
          }
        }
        return gaps;
      }

      function qualityState(value, warn, bad, reverse) {
        if (reverse) {
          if (value >= bad) return "good";
          if (value >= warn) return "warn";
          return "bad";
        }
        if (value >= bad) return "bad";
        if (value >= warn) return "warn";
        return "good";
      }

      function kmRangeText(segment) {
        if (!segment) return "brak";
        const from = Number.isFinite(segment.fromKm) ? segment.fromKm : 0;
        const to = Number.isFinite(segment.toKm) ? segment.toKm : from;
        return "km " + from.toFixed(1) + "-" + to.toFixed(1);
      }


      function robustGradeMax(grades) {
        const clean = (grades || []).map((value) => Math.abs(Number(value) || 0)).filter(Number.isFinite).sort((a, b) => b - a);
        if (!clean.length) return 0;
        if (clean.length < 5) return clean[0];
        const top = clean.slice(0, Math.min(5, clean.length));
        const topAvg = top.reduce((sum, value) => sum + value, 0) / top.length;
        const percentileIndex = clamp(Math.floor(clean.length * 0.08), 0, clean.length - 1);
        const p92 = clean[percentileIndex];
        return Math.max(p92, topAvg * 0.72 + clean[0] * 0.28);
      }

      function routeSegmentDifficulty(segment, type, totalKm) {
        if (!segment) return { label: "brak", level: "good", score: 0 };
        const grade = Math.abs(segment.maxGrade || 0);
        const avg = Math.abs(segment.avgGrade || 0);
        const change = type === "descent" ? (segment.dropM || 0) : (segment.gainM || 0);
        const distance = segment.distanceKm || 0;
        const late = totalKm > 0 && (segment.fromKm || 0) >= totalKm * 0.62;
        let score = grade * 1.35 + avg * 1.9 + change / 12 + distance * 0.9 + (late && type === "climb" ? 2 : 0);
        let label = type === "descent" ? "spokojny zjazd" : "łagodny podjazd";
        let level = "good";
        if (type === "climb") {
          if (grade >= 8 || avg >= 5.5 || change >= 70) { label = late ? "ciężki podjazd w końcówce" : "ciężki podjazd"; level = "bad"; }
          else if (grade >= 5.5 || avg >= 3.7 || change >= 38) { label = distance >= 0.8 ? "męczący podjazd" : "krótki mocny ząb"; level = "warn"; }
          else if (grade >= 3.2 || change >= 18) { label = "wyczuwalny podjazd"; level = "warn"; score *= 0.78; }
        } else {
          if (grade >= 9 || avg >= 6) { label = "stromy zjazd"; level = "bad"; }
          else if (grade >= 6 || avg >= 4) { label = "szybki zjazd"; level = "warn"; }
          else if (grade >= 3.2) { label = "łagodny zjazd"; level = "good"; score *= 0.72; }
        }
        return { label, level, score };
      }
      function profileSegmentAnalysis(stats) {
        const totalKm = stats.distanceKm || routeDistanceKm(state.routeLatLngs);
        const elevations = state.profileElevations && state.profileElevations.length >= 2
          ? state.profileElevations
          : (Array.isArray(stats.elevations) ? stats.elevations : []);
        if (elevations.length < 2 || !totalKm) {
          return { climbs: [], descents: [], worstClimb: null, worstDescent: null };
        }
        const distances = state.profileDistances && state.profileDistances.length === elevations.length
          ? state.profileDistances
          : elevations.map((_, index) => totalKm * index / Math.max(1, elevations.length - 1));
        const smoothElevations = state.profileSmoothElevations && state.profileSmoothElevations.length === elevations.length
          ? state.profileSmoothElevations
          : smoothedElevationSeries(elevations, distances, Math.max(0.18, gradeWindowForDistance(totalKm) * 0.62));
        const gradeWindow = Math.max(0.32, gradeWindowForDistance(totalKm));
        const climbs = [];
        const descents = [];
        let current = null;
        let neutralBridgeKm = 0;

        function finishSegment(endIndex) {
          if (!current) return;
          const safeEnd = clamp(endIndex, current.startIndex + 1, elevations.length - 1);
          const fromKm = distances[current.startIndex] || 0;
          const toKm = distances[safeEnd] || fromKm;
          const distanceKm = Math.max(0, toKm - fromKm);
          if (distanceKm <= 0) {
            current = null;
            neutralBridgeKm = 0;
            return;
          }
          const dz = smoothElevations[safeEnd] - smoothElevations[current.startIndex];
          if (current.type === "climb") {
            const gainM = Math.max(0, dz);
            const avgGrade = gainM / Math.max(distanceKm * 1000, 1) * 100;
            const meaningful = (distanceKm >= 0.28 && gainM >= 8 && (avgGrade >= 1.4 || current.maxGrade >= 3.0)) || gainM >= 18 || (distanceKm >= 0.65 && avgGrade >= 1.1);
            if (meaningful) {
              const segment = { fromKm, toKm, distanceKm, gainM, avgGrade, maxGrade: current.maxGrade };
              const diff = routeSegmentDifficulty(segment, "climb", totalKm);
              segment.difficulty = diff.label;
              segment.level = diff.level;
              segment.score = diff.score + current.maxGrade * 0.55 + gainM / 18 + distanceKm * 0.55;
              climbs.push(segment);
            }
          } else {
            const dropM = Math.max(0, -dz);
            const avgGrade = dropM / Math.max(distanceKm * 1000, 1) * 100;
            const meaningful = (distanceKm >= 0.28 && dropM >= 9 && (avgGrade >= 1.5 || Math.abs(current.minGrade) >= 3.2)) || dropM >= 20;
            if (meaningful) {
              const segment = { fromKm, toKm, distanceKm, dropM, avgGrade, maxGrade: Math.abs(current.minGrade) };
              const diff = routeSegmentDifficulty(segment, "descent", totalKm);
              segment.difficulty = diff.label;
              segment.level = diff.level;
              segment.score = diff.score + Math.abs(current.minGrade) * 0.45 + dropM / 24 + distanceKm * 0.45;
              descents.push(segment);
            }
          }
          current = null;
          neutralBridgeKm = 0;
        }

        for (let index = 1; index < elevations.length; index += 1) {
          const dKm = Math.max(0, (distances[index] || 0) - (distances[index - 1] || 0));
          if (!dKm) continue;
          const grade = stableGradeFromArrays(smoothElevations, distances, index, gradeWindow);
          const type = grade >= 0.95 ? "climb" : grade <= -0.95 ? "descent" : "";
          if (!type) {
            if (current && neutralBridgeKm + dKm <= 0.36) {
              neutralBridgeKm += dKm;
              continue;
            }
            finishSegment(index - 1);
            continue;
          }
          if (!current || current.type !== type) {
            finishSegment(index - 1);
            current = { type, startIndex: index - 1, maxGrade: grade, minGrade: grade };
          }
          neutralBridgeKm = 0;
          current.maxGrade = Math.max(current.maxGrade, grade);
          current.minGrade = Math.min(current.minGrade, grade);
        }
        finishSegment(elevations.length - 1);

        const worstClimb = climbs.slice().sort((a, b) => b.score - a.score)[0] || null;
        const worstDescent = descents.slice().sort((a, b) => b.score - a.score)[0] || null;
        return { climbs, descents, worstClimb, worstDescent };
      }
      function roadSampleReasons(sample) {
        const reasons = [];
        if (!sample) return reasons;
        if (sample.forbidden) reasons.push("zakazana/szybka droga");
        if (sample.national) reasons.push("DK");
        if (sample.voivodeship) reasons.push("DW");
        if (sample.main && !sample.national && !sample.voivodeship) reasons.push("droga główna");
        if (sample.unpaved) reasons.push(sample.forest ? "szuter/piach w lesie" : "grunt/szuter");
        if (sample.forest && !sample.unpaved) reasons.push("las");
        if (sample.unknownRoad) reasons.push("brak drogi OSM");
        if (sample.unknownSurface) reasons.push("nieznana nawierzchnia");
        return reasons;
      }

      function roadSampleSeverity(sample) {
        if (!sample) return 0;
        let score = Number(sample.risk) || 0;
        if (sample.forbidden) score += 7;
        if (sample.national) score += 4.5;
        if (sample.voivodeship) score += 2.4;
        if (sample.main) score += 1.3;
        if (sample.unpaved) score += 3.2;
        if (sample.forest && sample.unpaved) score += 4.2;
        else if (sample.forest) score += 1.1;
        if (sample.unknownRoad) score += 1.8;
        if (sample.unknownSurface) score += 1.2;
        return score;
      }

      function worstRoadSegment(stats, totalKm) {
        const samples = Array.isArray(stats.roadSamples) ? stats.roadSamples : [];
        if (!samples.length || !totalKm) return null;
        const stepKm = totalKm / Math.max(samples.length, 1);
        const groups = [];
        let current = null;

        function finishGroup(index) {
          if (!current) return;
          current.toKm = Math.min(totalKm, index * stepKm);
          current.distanceKm = Math.max(0, current.toKm - current.fromKm);
          current.reasonText = Array.from(current.reasons).slice(0, 3).join(", ");
          current.score = current.score / Math.max(current.count, 1) + current.distanceKm * 0.5;
          if (current.distanceKm >= 0.2 || current.score >= 7.5) groups.push(current);
          current = null;
        }

        samples.forEach((sample, index) => {
          const severity = roadSampleSeverity(sample);
          const reasons = roadSampleReasons(sample);
          const bad = severity >= 5.8 || sample.national || sample.forbidden || sample.unpaved || (sample.forest && sample.unknownSurface);
          if (!bad) {
            finishGroup(index);
            return;
          }
          if (!current) {
            current = {
              fromKm: index * stepKm,
              toKm: index * stepKm,
              distanceKm: 0,
              score: 0,
              count: 0,
              reasons: new Set()
            };
          }
          current.score += severity;
          current.count += 1;
          reasons.forEach((reason) => current.reasons.add(reason));
        });
        finishGroup(samples.length);
        return groups.sort((a, b) => b.score - a.score)[0] || null;
      }

      function routeControlAnalysis(stats, shops) {
        const totalKm = stats.distanceKm || routeDistanceKm(state.routeLatLngs);
        const profile = profileSegmentAnalysis(stats);
        const worstRoad = worstRoadSegment(stats, totalKm);
        const gaps = routeShopGaps(shops || [], totalKm);
        const maxGap = gaps.reduce((best, gap) => Math.max(best, gap.gapKm || 0), 0);
        const roadRiskKm = (stats.roadRiskKm || 0)
          + (stats.nationalKm || 0)
          + (stats.voivodeshipKm || 0) * 0.7
          + (stats.unpavedKm || 0)
          + (stats.forestUnpavedKm || 0) * 1.3
          + (stats.unknownRoadKm || 0) * 0.35
          + (stats.unknownSurfaceKm || 0) * 0.25;
        const goodRoadKm = stats.osmAvailable && totalKm ? clamp(totalKm - roadRiskKm, 0, totalKm) : 0;
        const lateClimbs = profile.climbs.filter((segment) => segment.fromKm >= totalKm * 0.62 && (segment.gainM >= 12 || segment.maxGrade >= 5));
        return {
          totalKm,
          climbs: profile.climbs,
          descents: profile.descents,
          worstClimb: profile.worstClimb,
          worstDescent: profile.worstDescent,
          worstRoad,
          goodRoadKm,
          goodRoadPercent: totalKm ? goodRoadKm / totalKm * 100 : 0,
          badRoadKm: stats.osmAvailable ? Math.max(0, totalKm - goodRoadKm) : 0,
          climbKm: profile.climbs.reduce((sum, segment) => sum + (segment.distanceKm || 0), 0),
          descentKm: profile.descents.reduce((sum, segment) => sum + (segment.distanceKm || 0), 0),
          climbGainM: profile.climbs.reduce((sum, segment) => sum + (segment.gainM || 0), 0),
          descentDropM: profile.descents.reduce((sum, segment) => sum + (segment.dropM || 0), 0),
          gaps,
          maxGap,
          lateClimbs
        };
      }

      function segmentListText(segments, type) {
        if (!segments.length) return type === "climb" ? "Brak wyraźnych podjazdów powyżej około 3%." : "Brak wyraźnych zjazdów powyżej około 3%.";
        return segments.slice(0, 5).map((segment) => {
          if (type === "climb") {
            return kmRangeText(segment) + ": +" + Math.round(segment.gainM) + " m, max " + segment.maxGrade.toFixed(1) + "%";
          }
          return kmRangeText(segment) + ": -" + Math.round(segment.dropM) + " m, max " + segment.maxGrade.toFixed(1) + "%";
        }).join(" | ");
      }

      function segmentCardsHtml(segments, type, emptyText) {
        const list = (segments || []).slice().sort((a, b) => (a.fromKm || 0) - (b.fromKm || 0)).slice(0, 10);
        if (!list.length) return '<div class="report-item good">' + escapeHtml(emptyText) + '</div>';
        const label = type === "descent" ? "Zjazd" : type === "badroad" ? "Droga" : "Podjazd";
        const cls = type === "descent" ? "descent" : type === "badroad" ? "badroad" : "climb";
        return '<div class="route-segment-grid">' + list.map((segment, index) => {
          const from = Number.isFinite(segment.fromKm) ? segment.fromKm : 0;
          const to = Number.isFinite(segment.toKm) ? segment.toKm : from;
          const range = kmRangeText(segment);
          const detail = type === "descent"
            ? '-' + Math.round(segment.dropM || 0) + ' m | max ' + (segment.maxGrade || 0).toFixed(1) + '% | dł. ' + (segment.distanceKm || 0).toFixed(1) + ' km | ' + (segment.difficulty || 'zjazd')
            : '+' + Math.round(segment.gainM || 0) + ' m | max ' + (segment.maxGrade || 0).toFixed(1) + '% | dł. ' + (segment.distanceKm || 0).toFixed(1) + ' km | ' + (segment.difficulty || 'podjazd');
          return '<div class="route-segment-card ' + cls + '"><div><strong>' + label + ' ' + (index + 1) + ' - ' + escapeHtml(range) + '</strong><span>' + escapeHtml(detail) + '</span></div><button type="button" data-jump-from="' + from.toFixed(3) + '" data-jump-to="' + to.toFixed(3) + '">Pokaż</button></div>';
        }).join("") + '</div>';
      }
      function kmPercentText(km, totalKm) {
        const value = Number(km) || 0;
        const percent = totalKm > 0 ? value / totalKm * 100 : 0;
        return value.toFixed(1) + " km / " + Math.round(percent) + "%";
      }

      function surfaceReliabilityText(stats, totalKm) {
        if (!stats.osmAvailable) return { value: "brak OSM", text: "analiza nawierzchni tylko orientacyjna", state: "warn" };
        const unknownKm = Math.min(totalKm, (stats.unknownRoadKm || 0) + (stats.unknownSurfaceKm || 0));
        const knownPercent = totalKm > 0 ? clamp(100 - unknownKm / totalKm * 100, 0, 100) : 0;
        return {
          value: Math.round(knownPercent) + "%",
          text: unknownKm > 0.2 ? "niepewne około " + unknownKm.toFixed(1) + " km" : "dane OSM wyglądają kompletne",
          state: qualityState(knownPercent, 70, 86, true)
        };
      }

      function buildSurfaceBreakdown(stats, analysis) {
        const totalKm = analysis.totalKm || stats.distanceKm || routeDistanceKm(state.routeLatLngs) || 0;
        const localBikeKm = Math.min(totalKm, (stats.localRoadKm || 0) + (stats.bikeKm || 0));
        const mainKm = (stats.nationalKm || 0) + (stats.voivodeshipKm || 0) + (stats.forbiddenKm || 0);
        const unknownKm = Math.min(totalKm, (stats.unknownRoadKm || 0) + (stats.unknownSurfaceKm || 0));
        const reliability = surfaceReliabilityText(stats, totalKm);
        const chips = [
          {
            label: "Asfalt / twarde",
            value: stats.osmAvailable ? kmPercentText(stats.pavedKm || 0, totalKm) : "brak OSM",
            text: "odcinki z nawierzchnią asfalt/paved/concrete wg OSM",
            state: stats.osmAvailable ? qualityState(totalKm > 0 ? (stats.pavedKm || 0) / totalKm * 100 : 0, 55, 75, true) : "warn"
          },
          {
            label: "Lokalne / rowerowe",
            value: stats.osmAvailable ? kmPercentText(localBikeKm, totalKm) : "brak OSM",
            text: "drogi lokalne i ścieżki rowerowe, zwykle spokojniejsze",
            state: stats.osmAvailable ? qualityState(totalKm > 0 ? localBikeKm / totalKm * 100 : 0, 45, 65, true) : "warn"
          },
          {
            label: "Szuter / grunt",
            value: kmPercentText(stats.unpavedKm || 0, totalKm),
            text: "gravel, dirt, sand, ground, grass albo podobne tagi OSM",
            state: qualityState(stats.unpavedKm || 0, 0.4, 1.4)
          },
          {
            label: "Las + grunt",
            value: kmPercentText(stats.forestUnpavedKm || 0, totalKm),
            text: "największe ryzyko piachu, błota albo trudnego przejazdu",
            state: qualityState(stats.forestUnpavedKm || 0, 0.2, 0.8)
          },
          {
            label: "DK / DW / główne",
            value: kmPercentText(mainKm, totalKm),
            text: "drogi szybkie lub większy ruch; autostrady są stale karane w kodzie",
            state: qualityState(mainKm, 0.5, 2.0)
          },
          {
            label: "Niepewna nawierzchnia",
            value: kmPercentText(unknownKm, totalKm),
            text: "brak drogi lub brak tagu surface w OSM, warto obejrzeć satelitę/mapę",
            state: qualityState(unknownKm, 1.0, 3.0)
          },
          {
            label: "Wiarygodność OSM",
            value: reliability.value,
            text: reliability.text,
            state: reliability.state
          }
        ];
        const surfaceRow = (label, km, note, state) => {
          const value = Math.max(0, Number(km) || 0);
          return {
            label,
            km: value,
            percent: totalKm > 0 ? value / totalKm * 100 : 0,
            note,
            state: state || ""
          };
        };
        const visibleRow = (item, index) => index === 0 || item.km > 0.05 || item.label === "Nieznane OSM";
        const surfaceRows = [
          surfaceRow("Dystans trasy", totalKm, "punkt odniesienia; część cech może się nakładać", "total"),
          surfaceRow("Asfalt / twarde", stats.osmAvailable ? (stats.pavedKm || 0) : 0, "asfalt, paved, concrete albo podobne tagi OSM", "good"),
          surfaceRow("Szuter / grunt", stats.unpavedKm || 0, "gravel, dirt, sand, ground, grass", qualityState(stats.unpavedKm || 0, 0.4, 1.4)),
          surfaceRow("Drogi lokalne", stats.localRoadKm || 0, "spokojniejsze klasy dróg, zwykle lepsze pod rower", "good"),
          surfaceRow("Rowerowe", stats.bikeKm || 0, "ścieżki i trasy rowerowe oznaczone w OSM", "good"),
          surfaceRow("Las razem", stats.forestKm || 0, "odcinki w obszarze leśnym, nawierzchnia może być różna", qualityState(stats.forestKm || 0, 4, 10)),
          surfaceRow("Las + grunt", stats.forestUnpavedKm || 0, "największe ryzyko piachu, błota i trudnego przejazdu", qualityState(stats.forestUnpavedKm || 0, 0.2, 0.8)),
          surfaceRow("DK", stats.nationalKm || 0, "drogi krajowe, zwykle większy ruch", qualityState(stats.nationalKm || 0, 0.2, 1.0)),
          surfaceRow("DW", stats.voivodeshipKm || 0, "drogi wojewódzkie, zależnie od regionu mogą być OK lub ruchliwe", qualityState(stats.voivodeshipKm || 0, 1.0, 4.0)),
          surfaceRow("Zakazane / szybkie", stats.forbiddenKm || 0, "autostrady, ekspresówki, trunk i podobne ryzyka", qualityState(stats.forbiddenKm || 0, 0.05, 0.2)),
          surfaceRow("Nieznane OSM", stats.osmAvailable ? unknownKm : totalKm, "brak drogi albo brak tagu surface, sprawdź satelitę/mapę", stats.osmAvailable ? qualityState(unknownKm, 1.0, 3.0) : "warn")
        ].filter(visibleRow);
        const notes = [];
        if (!stats.osmAvailable) notes.push("Nie ma pełnych danych OSM dla tej trasy, więc nawierzchnia jest tylko szacunkiem.");
        if ((stats.unpavedKm || 0) > 0.5) notes.push("Jeżeli jedziesz szosą, sprawdź szuter/grunt na satelicie albo przeciągnij trasę ręcznie.");
        if ((stats.forestUnpavedKm || 0) > 0.2) notes.push("Las + grunt to odcinki największego ryzyka: piach, korzenie, błoto lub zakaz przejazdu.");
        if (unknownKm > Math.max(2, totalKm * 0.08)) notes.push("Sporo nawierzchni jest nieoznaczone w OSM, więc plan traktuj ostrożnie.");
        notes.push("Tabela nawierzchni pokazuje cechy trasy. Asfalt, las, drogi lokalne i rowerowe mogą się częściowo nakładać.");
        if (!notes.length) notes.push("Nawierzchnia wygląda przewidywalnie według aktualnych danych OSM.");
        return { chips, notes, rows: surfaceRows };
      }

      function buildRouteQualityDetails(stats, shops) {
        const totalKm = stats.distanceKm || routeDistanceKm(state.routeLatLngs);
        const distanceTargetActive = usesDistanceTarget();
        const targetKm = distanceTargetActive ? (Number(dom.targetKm.value) || totalKm || 1) : (totalKm || 1);
        const distanceDelta = distanceTargetActive ? totalKm - targetKm : 0;
        const distanceDeltaPercent = distanceTargetActive ? Math.abs(distanceDelta) / Math.max(targetKm, 1) * 100 : 0;
        const gradeLimit = Number(dom.maxGrade.value) || 4;
        const unpavedKm = stats.unpavedKm || 0;
        const mainKm = (stats.nationalKm || 0) + (stats.voivodeshipKm || 0) + (stats.forbiddenKm || 0);
        const analysis = routeControlAnalysis(stats, shops || []);
        const worstClimb = analysis.worstClimb;
        const worstDescent = analysis.worstDescent;
        const worstRoad = analysis.worstRoad;
        const chips = [
          {
            label: "Suma podjazdów",
            value: "+" + Math.round(analysis.climbGainM || 0) + " m",
            text: analysis.climbs.length + " podj., razem " + (analysis.climbKm || 0).toFixed(1) + " km",
            state: worstClimb ? qualityState(worstClimb.maxGrade, gradeLimit, Math.max(gradeLimit + 3, 8)) : "good"
          },
          {
            label: "Suma zjazdów",
            value: "-" + Math.round(analysis.descentDropM || 0) + " m",
            text: analysis.descents.length + " zjazd., razem " + (analysis.descentKm || 0).toFixed(1) + " km",
            state: worstDescent && worstDescent.maxGrade >= 8 ? "warn" : "good"
          },
          {
            label: "Najmocniejszy podjazd",
            value: worstClimb ? kmRangeText(worstClimb) : "brak",
            text: worstClimb ? "max " + worstClimb.maxGrade.toFixed(1) + "%, +" + Math.round(worstClimb.gainM) + " m" : "brak mocnych odcinków",
            state: worstClimb ? qualityState(worstClimb.maxGrade, gradeLimit, Math.max(gradeLimit + 3, 8)) : "good"
          },
          {
            label: "Najgorsza droga",
            value: worstRoad ? kmRangeText(worstRoad) : "brak",
            text: worstRoad ? worstRoad.reasonText : "brak mocnych ostrzeżeń OSM",
            state: worstRoad ? "bad" : "good"
          },
          {
            label: "Dobra droga",
            value: stats.osmAvailable ? analysis.goodRoadKm.toFixed(1) + " km" : "brak OSM",
            text: stats.osmAvailable ? Math.round(analysis.goodRoadPercent) + "% trasy bez mocnych ryzyk" : "uruchom analizę dróg/kolor drogi",
            state: stats.osmAvailable ? qualityState(analysis.goodRoadPercent, 65, 82, true) : "warn"
          },
          {
            label: "Słaba nawierzchnia",
            value: unpavedKm.toFixed(1) + " km",
            text: (stats.forestUnpavedKm || 0) > 0 ? "w tym las+grunt " + (stats.forestUnpavedKm || 0).toFixed(1) + " km" : "grunt/szuter wg OSM",
            state: qualityState(unpavedKm, 0.5, 1.5)
          },
          {
            label: "DK/DW/główne",
            value: mainKm.toFixed(1) + " km",
            text: mainKm <= 0.4 ? "mało lub brak" : "sprawdź przejazd",
            state: qualityState(mainKm, 0.5, 2)
          },
          {
            label: "Końcówka trasy",
            value: analysis.lateClimbs.length ? analysis.lateClimbs.length + " podj." : "OK",
            text: analysis.lateClimbs.length ? "po " + (totalKm * 0.62).toFixed(0) + " km są jeszcze podjazdy" : "bez mocnej końcówki",
            state: analysis.lateClimbs.length ? "warn" : "good"
          },
          {
            label: "Przerwy bez sklepu",
            value: analysis.maxGap ? analysis.maxGap.toFixed(0) + " km" : ((shops || []).length ? "OK" : "brak danych"),
            text: (shops || []).length ? (shops || []).length + " sklepów przy trasie" : "kliknij Sklepy trasy",
            state: !(shops || []).length ? "warn" : qualityState(analysis.maxGap, 25, 40)
          }
        ];

        const recommendations = [];
        if (!state.routeLatLngs.length) {
          recommendations.push("Najpierw wyznacz albo wczytaj trasę, wtedy kontrola pokaże sensowną analizę.");
        } else {
          if (!stats.osmAvailable) recommendations.push("Brakuje pełnej analizy OSM: ryzyko dróg/asfalt/las może być orientacyjne.");
          if (distanceTargetActive && distanceDeltaPercent > 18) recommendations.push("Dystans mocno odbiega od celu: zmień dystans, dodaj punkt pośredni albo użyj innego wariantu.");
          if (worstClimb && worstClimb.maxGrade > gradeLimit) recommendations.push("Najmocniejszy podjazd jest na " + kmRangeText(worstClimb) + ": max " + worstClimb.maxGrade.toFixed(1) + "%, przewyższenie +" + Math.round(worstClimb.gainM) + " m.");
          if (worstRoad) recommendations.push("Najgorszy odcinek drogi: " + kmRangeText(worstRoad) + " (" + worstRoad.reasonText + ").");
          if ((stats.forestUnpavedKm || 0) > 0.2) recommendations.push("Jest ryzyko piachu/szutru w lesie: dla szosy przeciągnij odcinek na białe/lokalne drogi asfaltowe.");
          if (unpavedKm > 0.8) recommendations.push("Za dużo gruntu/szutru jak na ustawienia asfaltowe: użyj wariantu szosowego albo ręcznie omiń te odcinki.");
          if ((stats.nationalKm || 0) > 0.2) recommendations.push("Wykryto drogę krajową: jeśli chcesz spokojniej, dodaj punkt obok DK i przelicz.");
          if ((stats.voivodeshipKm || 0) > 2 && dom.avoidVoivodeshipRoads.checked) recommendations.push("Mimo unikania DW trasa ma odcinek wojewódzki: dodaj punkt lokalną drogą równoległą.");
          if (!(shops || []).length) recommendations.push("Nie ma jeszcze listy sklepów: kliknij Sklepy trasy, żeby sprawdzić postoje i długie przerwy bez sklepu.");
          if (!recommendations.length) recommendations.push(distanceTargetActive ? "Trasa wygląda spójnie: dystans blisko celu, niskie ryzyko dróg i brak mocnych ostrzeżeń." : "Własna trasa wygląda spójnie: oceniam faktyczny ślad, bez porównania do pola Dystans km.");
        }

        return {
          chips,
          recommendations: recommendations.slice(0, 7),
          analysis,
          surface: buildSurfaceBreakdown(stats, analysis),
          climbText: segmentListText(analysis.climbs, "climb"),
          descentText: segmentListText(analysis.descents, "descent")
        };
      }





      function lodgingTypeLabel(tags) {
        if (!tags) return "nocleg";
        if (tags.tourism === "hotel") return "hotel";
        if (tags.tourism === "guest_house") return "pensjonat / agroturystyka";
        if (tags.tourism === "hostel") return "hostel";
        if (tags.tourism === "motel") return "motel";
        if (tags.tourism === "apartment") return "apartament";
        if (tags.tourism === "camp_site") return "camping";
        if (tags.tourism === "caravan_site") return "pole campingowe";
        if (tags.tourism === "wilderness_hut") return "schron / chata";
        if (tags.amenity === "shelter") return "wiata / schronienie";
        return tags.tourism || tags.amenity || "nocleg";
      }

      function lodgingIcon() {
        return L.divIcon({
          className: "",
          html: '<span class="lodging-marker">NO</span>',
          iconSize: [28, 28],
          iconAnchor: [14, 14],
          popupAnchor: [0, -12]
        });
      }

      function routeLodgingQuery(route, radiusMeters) {
        const totalKm = routeDistanceKm(route);
        const samples = sampleRoute(route, Math.min(14, Math.max(5, Math.round(totalKm / 16))));
        const radius = Math.round(clamp(radiusMeters || 1600, 700, 2500));
        const path = samples.map((point) => point.lat.toFixed(6) + "," + point.lng.toFixed(6)).join(",");
        const tourismPattern = "^(hotel|guest_house|hostel|motel|apartment|camp_site|caravan_site|wilderness_hut)$";
        return [
          "[out:json][timeout:10];",
          "(",
          'node["tourism"~"' + tourismPattern + '"](around:' + radius + "," + path + ");",
          'node["amenity"="shelter"](around:' + radius + "," + path + ");",
          ");",
          "out body 120;"
        ].join("\n");
      }

      function lodgingsFromOverpassElements(elements, maxDistanceKm) {
        const seen = new Set();
        const lodgings = [];
        for (const element of elements || []) {
          const lat = Number(element.lat != null ? element.lat : element.center && element.center.lat);
          const lng = Number(element.lon != null ? element.lon : element.center && element.center.lon);
          if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;
          const tags = element.tags || {};
          const name = tags["name:pl"] || tags.name || tags.brand || lodgingTypeLabel(tags);
          const key = (name || "").toLowerCase().replace(/\s+/g, " ").trim() + "|" + lat.toFixed(4) + "," + lng.toFixed(4);
          if (seen.has(key)) continue;
          seen.add(key);
          const latlng = L.latLng(lat, lng);
          const context = routeDistanceContext(latlng);
          if (context.distanceFromRouteKm > maxDistanceKm) continue;
          lodgings.push({
            latlng,
            tags,
            name,
            type: lodgingTypeLabel(tags),
            distanceFromRouteKm: context.distanceFromRouteKm,
            distanceAlongKm: context.distanceAlongKm
          });
        }
        return lodgings.sort((a, b) => a.distanceAlongKm - b.distanceAlongKm || a.distanceFromRouteKm - b.distanceFromRouteKm).slice(0, 60);
      }

      function mergeRouteLodgings(existing, incoming, maxDistanceKm) {
        const byKey = new Map();
        for (const item of (existing || []).concat(incoming || [])) {
          const key = ((item.name || "").toLowerCase().replace(/\s+/g, " ").trim() || (item.latlng.lat.toFixed(4) + "," + item.latlng.lng.toFixed(4)));
          if ((item.distanceFromRouteKm || 0) > maxDistanceKm) continue;
          const previous = byKey.get(key);
          if (!previous || item.distanceFromRouteKm < previous.distanceFromRouteKm) byKey.set(key, item);
        }
        return Array.from(byKey.values()).sort((a, b) => a.distanceAlongKm - b.distanceAlongKm || a.distanceFromRouteKm - b.distanceFromRouteKm).slice(0, 70);
      }

      function drawRouteLodgings(lodgings) {
        routeLodgingLayer.clearLayers();
        for (const item of lodgings || []) {
          const details = [
            "km " + item.distanceAlongKm.toFixed(1),
            Math.round(item.distanceFromRouteKm * 1000) + " m od trasy",
            item.type
          ];
          L.marker(item.latlng, {
            icon: lodgingIcon(),
            pane: "attractionsPane",
            title: item.name
          })
            .bindPopup('<div class="shop-popup lodging-popup"><strong>' + escapeHtml(item.name) + '</strong>' + escapeHtml(details.join(" | ")) + "</div>", { className: "dark-route-popup" })
            .addTo(routeLodgingLayer);
        }
      }

      async function loadRouteLodgings() {
        if (!state.routeLatLngs.length) {
          setStatus("Najpierw wyznacz albo wczytaj trasę, potem sprawdzę noclegi przy trasie.", "warn");
          openTripPlan();
          return;
        }
        if (state.busy) return;
        try {
          setBusy(true);
          configureBusyTimer("Noclegi trasy", 10);
          setStatus("Szukam noclegów przy trasie z OpenStreetMap...");
          const data = await fetchOverpass(routeLodgingQuery(state.routeLatLngs, 1600), { fast: true, timeoutMs: 12000 });
          const lodgings = mergeRouteLodgings([], lodgingsFromOverpassElements(data.elements || [], 1.8), 1.8);
          state.routeLodgings = lodgings;
          drawRouteLodgings(lodgings);
          openTripPlan();
          setStatus(lodgings.length ? "Noclegi przy trasie: " + lodgings.length + ". Dodałem je do mapy i planu dnia." : "Nie znalazłem noclegów do około 1,8 km od trasy.", lodgings.length ? "" : "warn");
        } catch (error) {
          setStatus("Nie udało się pobrać noclegów: " + error.message, "warn");
          openTripPlan();
        } finally {
          setBusy(false);
        }
      }

      function plannedBreakListItems(totalKm) {
        const everyKm = plannedBreakDistanceKm();
        if (!state.routeLatLngs.length || !everyKm || totalKm <= everyKm * 0.75) return [];
        const items = [];
        let index = 1;
        for (let distanceKm = everyKm; distanceKm < totalKm - 0.25; distanceKm += everyKm) {
          items.push({ label: "P" + index, km: distanceKm, text: "planowana przerwa co " + everyKm.toFixed(0) + " km" });
          index += 1;
          if (index > 80) break;
        }
        return items;
      }

      function routeNearbyHtml(totalKm, shops, attractions, lodgings) {
        const breaks = plannedBreakListItems(totalKm);
        lodgings = lodgings || [];
        const rows = [];
        if (shops.length) {
          rows.push('<div class="nearby-title">Sklepy przy trasie (' + shops.length + ')</div>');
          rows.push(shops.slice(0, 12).map((shop) => '<div class="nearby-item shop"><strong>SK km ' + shop.distanceAlongKm.toFixed(1) + ' - ' + escapeHtml(shop.name) + '</strong><span>' + escapeHtml(shop.type) + ' | ' + Math.round(shop.distanceFromRouteKm * 1000) + ' m od trasy</span></div>').join(""));
        } else {
          rows.push('<div class="nearby-item warn"><strong>Sklepy: brak danych</strong><span>Kliknij „Sklepy trasy”, wtedy pokażę sklepy według kilometrów śladu.</span></div>');
        }
        if (attractions.length) {
          rows.push('<div class="nearby-title">Atrakcje przy trasie (' + attractions.length + ')</div>');
          rows.push(attractions.slice(0, 12).map((item) => '<div class="nearby-item attraction"><strong>AT km ' + item.distanceAlongKm.toFixed(1) + ' - ' + escapeHtml(item.name) + '</strong><span>' + escapeHtml(item.type) + ' | ' + Math.round(item.distanceFromRouteKm * 1000) + ' m od trasy</span></div>').join(""));
        } else {
          rows.push('<div class="nearby-item warn"><strong>Atrakcje: brak danych</strong><span>Kliknij „Atrakcje trasy”, wtedy pokażę punkty ciekawe przy samym śladzie.</span></div>');
        }
        if (lodgings.length) {
          rows.push('<div class="nearby-title">Noclegi przy trasie (' + lodgings.length + ')</div>');
          rows.push(lodgings.slice(0, 10).map((item) => '<div class="nearby-item lodging"><strong>NO km ' + item.distanceAlongKm.toFixed(1) + ' - ' + escapeHtml(item.name) + '</strong><span>' + escapeHtml(item.type) + ' | ' + Math.round(item.distanceFromRouteKm * 1000) + ' m od trasy</span></div>').join(""));
        } else if (totalKm >= 120) {
          rows.push('<div class="nearby-item warn"><strong>Noclegi: brak danych</strong><span>Dla długiej trasy kliknij „Noclegi trasy”, szczególnie gdy planujesz wyprawę na 2 dni.</span></div>');
        }
        if (breaks.length) {
          rows.push('<div class="nearby-title">Planowane przerwy (' + breaks.length + ')</div>');
          rows.push(breaks.slice(0, 16).map((item) => '<div class="nearby-item break"><strong>' + escapeHtml(item.label) + ' około km ' + item.km.toFixed(1) + '</strong><span>' + escapeHtml(item.text) + '</span></div>').join(""));
        }
        return rows.join("");
      }

      function buildRouteWarnings() {
        const stats = state.stats || {};
        const totalKm = stats.distanceKm || routeDistanceKm(state.routeLatLngs);
        const warnings = [];
        if (!state.routeLatLngs.length) {
          warnings.push({ level: "warn", text: "Brak wyznaczonej trasy do kontroli." });
          return warnings;
        }
        if ((stats.maxGrade || 0) >= 10) warnings.push({ level: "bad", text: "Bardzo stromy fragment: max około " + stats.maxGrade.toFixed(1) + "%." });
        else if ((stats.maxGrade || 0) >= 6) warnings.push({ level: "warn", text: "Mocny podjazd na trasie: max około " + stats.maxGrade.toFixed(1) + "%." });
        if ((stats.steepKm || 0) >= 2) warnings.push({ level: "warn", text: "Dłuższe strome odcinki: razem około " + stats.steepKm.toFixed(1) + " km ponad ustawiony limit." });
        if ((stats.forestUnpavedKm || 0) > 0.2) warnings.push({ level: "bad", text: "Podejrzenie piachu/szutru w lesie: około " + stats.forestUnpavedKm.toFixed(1) + " km." });
        else if ((stats.forestKm || 0) > 3) warnings.push({ level: "warn", text: "Trasa przechodzi przez las: około " + stats.forestKm.toFixed(1) + " km." });
        if ((stats.unpavedKm || 0) > 1) warnings.push({ level: "bad", text: "Nieutwardzona nawierzchnia według OSM: około " + stats.unpavedKm.toFixed(1) + " km." });
        if ((stats.roadRiskPercent || 0) >= 20) warnings.push({ level: "bad", text: "Podwyższone ryzyko dróg: " + Math.round(stats.roadRiskPercent) + "%." });
        if ((stats.nationalKm || 0) > 0.2) warnings.push({ level: "bad", text: "Odcinek po drodze krajowej: około " + stats.nationalKm.toFixed(1) + " km." });
        const gaps = routeShopGaps(state.routeFoodShops || [], totalKm);
        for (const gap of gaps.slice(0, 3)) {
          warnings.push({ level: gap.gapKm >= 35 ? "bad" : "warn", text: "Długi odcinek bez sklepu przy trasie: km " + gap.fromKm.toFixed(0) + "-" + gap.toKm.toFixed(0) + " (" + gap.gapKm.toFixed(0) + " km)." });
        }
        if (!warnings.length) warnings.push({ level: "ok", text: "Brak mocnych ostrzeżeń według aktualnych danych." });
        return warnings;
      }


      function routePercentCell(km, totalKm) {
        const value = Math.max(0, Number(km) || 0);
        const percent = totalKm > 0 ? value / totalKm * 100 : 0;
        return value.toFixed(1) + " km / " + Math.round(percent) + "%";
      }

      function routeWeatherReport() {
        const items = Array.isArray(state.weatherItems) ? state.weatherItems : [];
        if (!items.length) {
          return {
            summary: "Brak pobranej pogody. Kliknij Pogoda trasy, a raport dopisze temperaturę, deszcz, wiatr i trudniejsze warunki na odcinkach.",
            rows: [{ label: "Pogoda", value: "brak danych", note: "kliknij Pogoda trasy" }],
            tips: ["Przed wyjazdem kliknij Pogoda trasy, żeby ocena przygotowania była liczona pod konkretną godzinę i przebieg trasy."]
          };
        }
        const temps = items.map((item) => Number(item.weather && item.weather.temperature)).filter(Number.isFinite);
        const rain = items.map((item) => Number(item.weather && item.weather.rainChance)).filter(Number.isFinite);
        const gusts = items.map((item) => Number(item.weather && (item.weather.windGust || item.weather.windSpeed))).filter(Number.isFinite);
        const winds = items.map((item) => Number(item.weather && item.weather.windSpeed)).filter(Number.isFinite);
        const worst = items.reduce((best, item) => {
          const hazard = weatherHazardInfo(item);
          return !best || hazard.score > best.hazard.score ? { item, hazard } : best;
        }, null);
        const minTemp = temps.length ? Math.round(Math.min(...temps)) : null;
        const maxTemp = temps.length ? Math.round(Math.max(...temps)) : null;
        const maxRain = rain.length ? Math.round(Math.max(...rain)) : 0;
        const maxGust = gusts.length ? Math.round(Math.max(...gusts)) : 0;
        const avgWind = winds.length ? Math.round(winds.reduce((sum, value) => sum + value, 0) / winds.length) : 0;
        const headwind = items.filter((item) => item.wind && item.wind.tone === "bad").length;
        const sidewind = items.filter((item) => item.wind && item.wind.tone === "warn").length;
        const summary = "Temperatura " + (minTemp != null ? minTemp + "-" + maxTemp + "°C" : "brak") + ", deszcz max " + maxRain + "%, wiatr średnio " + avgWind + " km/h, porywy do " + maxGust + " km/h" + (headwind ? ", odcinki z wiatrem w twarz: " + headwind : sidewind ? ", boczny wiatr: " + sidewind : ", wiatr bez mocnych ostrzeżeń") + ".";
        const rows = [
          { label: "Temperatura", value: minTemp != null ? minTemp + "-" + maxTemp + "°C" : "brak", note: "zakres z punktów pogodowych na trasie" },
          { label: "Deszcz", value: maxRain + "%", note: maxRain >= 55 ? "wysokie ryzyko, kurtka obowiązkowo" : maxRain >= 30 ? "możliwy deszcz" : "bez mocnego ryzyka" },
          { label: "Wiatr", value: avgWind + "/" + maxGust + " km/h", note: headwind ? "miejsca z wiatrem w twarz" : sidewind ? "głównie boczny" : "raczej spokojnie" },
          { label: "Najtrudniej pogodowo", value: worst ? "km " + worst.item.distanceKm.toFixed(1) : "brak", note: worst ? worst.hazard.title + ": " + worst.hazard.reasons.slice(0, 2).join(", ") : "brak mocnych ostrzeżeń" }
        ];
        const tips = [];
        if (maxRain >= 30) tips.push("Weź kurtkę przeciwdeszczową albo wiatrówkę; opady w raporcie przekraczają " + maxRain + "%.");
        if (maxGust >= 38) tips.push("Uwaga na porywy wiatru do " + maxGust + " km/h: zostaw zapas sił na otwarte odcinki.");
        if (headwind >= 2) tips.push("Masz kilka punktów z wiatrem w twarz: nie ustawiaj zbyt ambitnej średniej na całą trasę.");
        if (minTemp != null && minTemp <= 10) tips.push("Temperatura spada do około " + minTemp + "°C: rękawki/kamizelka mogą się przydać.");
        if (!tips.length) tips.push("Pogoda wygląda przejezdnie; pilnuj tylko nawodnienia i aktualizacji prognozy przed startem.");
        return { summary, rows, tips };
      }

      function routePreparationTips(stats, details, weather) {
        const analysis = details.analysis || routeControlAnalysis(stats, state.routeFoodShops || []);
        const totalKm = analysis.totalKm || stats.distanceKm || routeDistanceKm(state.routeLatLngs) || 0;
        const avgSpeed = Math.max(8, Number(dom.avgSpeed.value) || 20);
        const hours = totalKm / avgSpeed;
        const kcal = calorieEstimate(stats);
        const bottles = Math.max(1, Math.ceil(hours * 0.75));
        const foodEvery = totalKm >= 80 ? "jedz coś co 35-45 km" : totalKm >= 40 ? "weź przynajmniej 1-2 przekąski" : "krótka trasa, wystarczy mały zapas";
        const tips = [
          "Czas jazdy około " + formatRideTime(totalKm) + " przy średniej " + avgSpeed + " km/h; kalorie orientacyjnie " + kcal + " kcal.",
          "Picie: minimum " + bottles + " bid. po 0,5-0,75 l" + (hours >= 4 ? ", a w upał więcej" : "") + ".",
          "Jedzenie: " + foodEvery + ", szczególnie przed dłuższymi podjazdami.",
          "Najmocniejszy podjazd: " + (analysis.worstClimb ? kmRangeText(analysis.worstClimb) + ", max " + analysis.worstClimb.maxGrade.toFixed(1) + "%, +" + Math.round(analysis.worstClimb.gainM) + " m" : "brak wyraźnego mocnego podjazdu") + "."
        ];
        if ((stats.unpavedKm || 0) > 0.5 || (stats.forestUnpavedKm || 0) > 0.2) tips.push("Opony/rower: wykryto grunt/szuter lub las+grunt, więc szosa może wymagać ręcznej korekty trasy.");
        if ((stats.nationalKm || 0) > 0.2 || (stats.voivodeshipKm || 0) > 2) tips.push("Ruch drogowy: sprawdź odcinki DK/DW, zwłaszcza jeśli jedziesz samotnie albo poza weekendem.");
        (weather.tips || []).slice(0, 3).forEach((tip) => tips.push(tip));
        return tips.slice(0, 9);
      }

      function routeSegmentRows(segments, type) {
        const list = (segments || []).slice().sort((a, b) => (b.score || 0) - (a.score || 0)).slice(0, 8);
        if (!list.length) return '<tr><td colspan="5">Brak wyraźnych odcinków.</td></tr>';
        return list.map((segment, index) => {
          const change = type === "descent" ? "-" + Math.round(segment.dropM || 0) + " m" : "+" + Math.round(segment.gainM || 0) + " m";
          const difficulty = segment.difficulty ? " | " + segment.difficulty : "";
          return '<tr><td>' + (index + 1) + '</td><td>' + escapeHtml(kmRangeText(segment)) + '</td><td>' + (segment.distanceKm || 0).toFixed(1) + ' km</td><td>' + change + '</td><td>' + (segment.maxGrade || 0).toFixed(1) + '%' + escapeHtml(difficulty) + '</td></tr>';
        }).join("");
      }


      function proScoreState(score) {
        const value = Number(score) || 0;
        if (value >= 78) return "good";
        if (value >= 55) return "warn";
        return "bad";
      }

      function proScoreLabel(score) {
        const value = Number(score) || 0;
        if (value >= 84) return "bardzo dobrze";
        if (value >= 70) return "dobrze";
        if (value >= 55) return "średnio";
        if (value >= 38) return "trudno";
        return "ryzykownie";
      }

      function routeWeatherNumbers() {
        const items = Array.isArray(state.weatherItems) ? state.weatherItems : [];
        const nums = (mapper) => items.map(mapper).filter(Number.isFinite);
        const temps = nums((item) => Number(item.weather && item.weather.temperature));
        const rain = nums((item) => Number(item.weather && item.weather.rainChance));
        const gusts = nums((item) => Number(item.weather && (item.weather.windGust || item.weather.windSpeed)));
        const winds = nums((item) => Number(item.weather && item.weather.windSpeed));
        const badWindItems = items.filter((item) => item.wind && item.wind.tone === "bad");
        const worst = items.reduce((best, item) => {
          const hazard = weatherHazardInfo(item);
          return !best || hazard.score > best.hazard.score ? { item, hazard } : best;
        }, null);
        return {
          hasWeather: items.length > 0,
          minTemp: temps.length ? Math.min(...temps) : null,
          maxTemp: temps.length ? Math.max(...temps) : null,
          maxRain: rain.length ? Math.max(...rain) : 0,
          maxGust: gusts.length ? Math.max(...gusts) : 0,
          avgWind: winds.length ? winds.reduce((sum, value) => sum + value, 0) / winds.length : 0,
          headwindCount: badWindItems.length,
          worst
        };
      }

      function buildRouteProAssessment(stats, analysis, weather) {
        const totalKm = analysis.totalKm || stats.distanceKm || routeDistanceKm(state.routeLatLngs) || 0;
        const distanceTargetActive = usesDistanceTarget();
        const targetKm = distanceTargetActive ? (Number(dom.targetKm && dom.targetKm.value) || totalKm || 1) : (totalKm || 1);
        const gradeLimit = Number(dom.maxGrade && dom.maxGrade.value) || 4;
        const distanceDeltaPercent = distanceTargetActive ? Math.abs(totalKm - targetKm) / Math.max(targetKm, 1) * 100 : 0;
        const mainKm = (stats.nationalKm || 0) + (stats.voivodeshipKm || 0) + (stats.forbiddenKm || 0);
        const unknownKm = stats.osmAvailable ? Math.min(totalKm, (stats.unknownRoadKm || 0) + (stats.unknownSurfaceKm || 0)) : totalKm;
        const pavedPercent = stats.osmAvailable && totalKm ? (stats.pavedKm || 0) / totalKm * 100 : 0;
        const unpavedPercent = totalKm ? (stats.unpavedKm || 0) / totalKm * 100 : 0;
        const forestRiskKm = (stats.forestUnpavedKm || 0) + Math.max(0, (stats.forestKm || 0) - (stats.forestUnpavedKm || 0)) * 0.18;
        const ascentPerKm = totalKm ? (stats.ascentM || 0) / totalKm : 0;
        const worstClimb = analysis.worstClimb;
        const worstDescent = analysis.worstDescent;
        const hardClimbs = (analysis.climbs || []).filter((segment) => (segment.maxGrade || 0) >= Math.max(gradeLimit, 5.5) || (segment.gainM || 0) >= 45);
        const weatherNums = routeWeatherNumbers();
        const climbScore = clamp(100 - Math.max(0, ((worstClimb && worstClimb.maxGrade) || stats.maxGrade || 0) - gradeLimit) * 9 - ascentPerKm * 0.42 - hardClimbs.length * 8 - (analysis.lateClimbs || []).length * 6, 0, 100);
        const surfaceScore = stats.osmAvailable
          ? clamp(100 - unpavedPercent * 8 - (stats.forestUnpavedKm || 0) * 22 - unknownKm / Math.max(totalKm, 1) * 55 - Math.max(0, 70 - pavedPercent) * 0.35, 0, 100)
          : 52;
        const roadScore = stats.osmAvailable
          ? clamp(100 - (stats.roadRiskPercent || 0) * 1.15 - (stats.nationalKm || 0) * 22 - (stats.voivodeshipKm || 0) * 5.5 - (stats.forbiddenKm || 0) * 70 - mainKm / Math.max(totalKm, 1) * 90, 0, 100)
          : 56;
        const weatherScore = weatherNums.hasWeather
          ? clamp(100 - Math.max(0, weatherNums.maxRain - 25) * 0.85 - Math.max(0, weatherNums.maxGust - 28) * 1.8 - weatherNums.headwindCount * 4.2 - (weatherNums.minTemp != null && weatherNums.minTemp < 8 ? (8 - weatherNums.minTemp) * 3 : 0), 0, 100)
          : 60;
        const distanceScore = distanceTargetActive ? clamp(100 - distanceDeltaPercent * 2.15 - Math.max(0, totalKm - 120) * 0.12, 0, 100) : 100;
        const overall = Math.round(climbScore * 0.26 + surfaceScore * 0.24 + roadScore * 0.22 + weatherScore * 0.14 + distanceScore * 0.14);
        const verdict = overall >= 78 ? "JEDŹ" : overall >= 58 ? "OSTROŻNIE" : "POPRAW TRASĘ";
        const bike = !stats.osmAvailable ? "sprawdź nawierzchnię" : (stats.unpavedKm || 0) > 2 || (stats.forestUnpavedKm || 0) > 0.5 ? "gravel / MTB" : mainKm > 2 ? "gravel lub szosa z ostrożnością" : "szosa / gravel OK";
        const scores = [
          { label: "Podjazdy", score: Math.round(climbScore), note: hardClimbs.length ? hardClimbs.length + " trudn. odc." : "bez mocnej serii" },
          { label: "Nawierzchnia", score: Math.round(surfaceScore), note: stats.osmAvailable ? routePercentCell(stats.pavedKm || 0, totalKm) + " asfalt" : "brak pełnego OSM" },
          { label: "Drogi", score: Math.round(roadScore), note: mainKm.toFixed(1) + " km DK/DW/szybkich" },
          { label: "Pogoda", score: Math.round(weatherScore), note: weatherNums.hasWeather ? Math.round(weatherNums.avgWind) + "/" + Math.round(weatherNums.maxGust) + " km/h wiatr" : "kliknij Pogoda trasy" },
          { label: "Dystans", score: Math.round(distanceScore), note: distanceTargetActive ? ((totalKm - targetKm >= 0 ? "+" : "") + (totalKm - targetKm).toFixed(1) + " km od celu") : (totalKm.toFixed(1) + " km własnego śladu") }
        ];
        const warnings = [];
        if (worstClimb && ((worstClimb.maxGrade || 0) >= gradeLimit || (worstClimb.gainM || 0) >= 25)) {
          warnings.push({ level: (worstClimb.maxGrade || 0) >= Math.max(gradeLimit + 3, 8) ? "bad" : "warn", title: "Najmocniejszy podjazd", km: kmRangeText(worstClimb), text: (worstClimb.difficulty || "podjazd") + ": max " + worstClimb.maxGrade.toFixed(1) + "%, +" + Math.round(worstClimb.gainM || 0) + " m, długość " + (worstClimb.distanceKm || 0).toFixed(1) + " km", action: "zostaw zapas przełożenia i nie ciśnij początku" });
        }
        const climbSeries = (analysis.climbs || []).slice().sort((a, b) => (a.fromKm || 0) - (b.fromKm || 0)).reduce((best, segment, index, list) => {
          const group = list.filter((item) => (item.fromKm || 0) >= (segment.fromKm || 0) && (item.fromKm || 0) <= (segment.fromKm || 0) + 8.0);
          const gain = group.reduce((sum, item) => sum + (item.gainM || 0), 0);
          const maxGrade = group.reduce((max, item) => Math.max(max, item.maxGrade || 0), 0);
          const score = gain + group.length * 12 + maxGrade * 5;
          return !best || score > best.score ? { fromKm: segment.fromKm || 0, toKm: Math.max(...group.map((item) => item.toKm || item.fromKm || 0)), count: group.length, gain, maxGrade, score } : best;
        }, null);
        if (climbSeries && climbSeries.count >= 2 && climbSeries.gain >= 35) {
          warnings.push({ level: climbSeries.gain >= 75 || climbSeries.count >= 4 ? "bad" : "warn", title: "Seria podjazdów", km: "km " + climbSeries.fromKm.toFixed(1) + "-" + climbSeries.toKm.toFixed(1), text: climbSeries.count + " podj. blisko siebie, razem +" + Math.round(climbSeries.gain) + " m, max " + climbSeries.maxGrade.toFixed(1) + "%", action: "tu najbardziej pilnuj tempa i jedzenia" });
        }
        (analysis.lateClimbs || []).slice(0, 2).forEach((segment) => {
          warnings.push({ level: "warn", title: "Podjazd w końcówce", km: kmRangeText(segment), text: "+" + Math.round(segment.gainM || 0) + " m, max " + (segment.maxGrade || 0).toFixed(1) + "% po przejechaniu większości trasy", action: "zaplanuj jedzenie przed tym odcinkiem" });
        });
        if (worstDescent && (worstDescent.maxGrade || 0) >= 6) {
          warnings.push({ level: (worstDescent.maxGrade || 0) >= 9 ? "bad" : "warn", title: "Stromy zjazd", km: kmRangeText(worstDescent), text: (worstDescent.difficulty || "zjazd") + ": max " + worstDescent.maxGrade.toFixed(1) + "%, spadek -" + Math.round(worstDescent.dropM || 0) + " m", action: "sprawdź zakręty, hamulce i nawierzchnię" });
        }
        if (analysis.worstRoad) {
          warnings.push({ level: "bad", title: "Najgorszy odcinek drogi", km: kmRangeText(analysis.worstRoad), text: analysis.worstRoad.reasonText || "ryzykowny odcinek wg OSM", action: "przy szosie przeciągnij trasę na drogę lokalną" });
        }
        if ((stats.forestUnpavedKm || 0) > 0.2) warnings.push({ level: "bad", title: "Las + grunt", km: "razem " + (stats.forestUnpavedKm || 0).toFixed(1) + " km", text: "największe ryzyko piachu, błota albo korzeni", action: "dla szosy omijaj ręczną korektą" });
        if ((stats.unpavedKm || 0) > 1) warnings.push({ level: "warn", title: "Szuter / grunt", km: "razem " + (stats.unpavedKm || 0).toFixed(1) + " km", text: "trasa może być wolniejsza niż wynik ze średniej", action: "sprawdź satelitę albo wybierz wariant szosowy" });
        if ((stats.nationalKm || 0) > 0.2) warnings.push({ level: "bad", title: "Droga krajowa", km: "razem " + (stats.nationalKm || 0).toFixed(1) + " km", text: "większy ruch i mniej komfortu", action: "dodaj punkt przez lokalną drogę równoległą" });
        if (unknownKm > Math.max(2, totalKm * 0.08)) warnings.push({ level: "warn", title: "Niepewne dane OSM", km: routePercentCell(unknownKm, totalKm), text: "część nawierzchni lub drogi nie ma pełnych tagów", action: "przed jazdą sprawdź mapę satelitarną" });
        const gaps = routeShopGaps(state.routeFoodShops || [], totalKm);
        gaps.filter((gap) => gap.gapKm >= 28).slice(0, 2).forEach((gap) => {
          warnings.push({ level: gap.gapKm >= 42 ? "bad" : "warn", title: "Długi odcinek bez sklepu", km: "km " + gap.fromKm.toFixed(0) + "-" + gap.toKm.toFixed(0), text: gap.gapKm.toFixed(0) + " km bez sklepu przy trasie", action: "dobierz wodę i jedzenie wcześniej" });
        });
        if (weatherNums.worst && weatherNums.worst.hazard && weatherNums.worst.hazard.score >= 3) {
          warnings.push({ level: weatherNums.worst.hazard.score >= 6 ? "bad" : "warn", title: "Najtrudniejsza pogoda", km: "km " + weatherNums.worst.item.distanceKm.toFixed(1), text: weatherNums.worst.hazard.title + " - " + weatherNums.worst.hazard.reasons.slice(0, 2).join(", "), action: "skoryguj tempo i ubranie" });
        } else if (!weatherNums.hasWeather) {
          warnings.push({ level: "warn", title: "Pogoda niepoliczona", km: "cała trasa", text: "raport nie zna temperatury, deszczu i wiatru", action: "kliknij Pogoda trasy przed wyjazdem" });
        }
        if (!warnings.length) warnings.push({ level: "good", title: "Bez mocnych alarmów", km: "cała trasa", text: "profil i droga wyglądają przewidywalnie", action: "zapisz GPX i jedź rozsądnie" });
        return { overall, verdict, bike, scores, warnings: warnings.slice(0, 9), weatherNums };
      }

      function routeProScoreHtml(pro) {
        return '<div class="route-pro-score-grid">' + pro.scores.map((item) => {
          const score = clamp(Number(item.score) || 0, 0, 100);
          const cls = proScoreState(score);
          return '<div class="route-pro-score ' + cls + '"><div class="route-pro-score-head"><span>' + escapeHtml(item.label) + '</span><strong>' + Math.round(score) + '/100</strong></div><div class="route-pro-meter"><i style="width:' + score.toFixed(0) + '%"></i></div><small>' + escapeHtml(proScoreLabel(score) + ' - ' + item.note) + '</small></div>';
        }).join("") + '</div>';
      }

      function routeProWarningsHtml(pro) {
        return '<div class="route-pro-warning-list">' + pro.warnings.map((item) => '<div class="route-pro-warning ' + (item.level || "warn") + '"><strong>' + escapeHtml(item.title) + '</strong><span>' + escapeHtml(item.km + ': ' + item.text) + '</span><em>' + escapeHtml(item.action) + '</em></div>').join("") + '</div>';
      }
      function renderRouteQualityModal() {
        if (!state.routeLatLngs.length || !state.stats) {
          dom.routeReportTitle.textContent = "Raport trasy";
          dom.routeReportSummary.innerHTML = '<div class="report-tile"><span>Brak trasy</span><strong>Najpierw wyznacz albo wczytaj GPX</strong></div>';
          dom.routeReportDetails.innerHTML = '<div class="report-item warn">Raport pojawi się po wyznaczeniu trasy. Wtedy pokażę podjazdy, zjazdy, nawierzchnię, las, drogi, pogodę i przygotowanie.</div>';
          dom.routeWarningList.innerHTML = "";
          dom.routeStopList.innerHTML = "";
          if (dom.routeNearbyList) dom.routeNearbyList.innerHTML = "";
          return;
        }
        const stats = state.stats || {};
        const shops = state.routeFoodShops || [];
        const details = buildRouteQualityDetails(stats, shops);
        const analysis = details.analysis || routeControlAnalysis(stats, shops);
        const weather = routeWeatherReport();
        const totalKm = analysis.totalKm || stats.distanceKm || routeDistanceKm(state.routeLatLngs) || 0;
        const pavedKm = stats.osmAvailable ? (stats.pavedKm || 0) : 0;
        const localBikeKm = stats.osmAvailable ? Math.min(totalKm, (stats.localRoadKm || 0) + (stats.bikeKm || 0)) : 0;
        const unpavedKm = stats.unpavedKm || 0;
        const forestKm = stats.forestKm || 0;
        const mainKm = (stats.nationalKm || 0) + (stats.voivodeshipKm || 0) + (stats.forbiddenKm || 0);
        const unknownKm = stats.osmAvailable ? Math.min(totalKm, (stats.unknownRoadKm || 0) + (stats.unknownSurfaceKm || 0)) : totalKm;
        const tips = routePreparationTips(stats, details, weather);
        const pro = buildRouteProAssessment(stats, analysis, weather);
        const labelText = dom.qualityBadge ? dom.qualityBadge.textContent.replace("Jakość trasy - ", "") : "brak";
        dom.routeReportTitle.textContent = "Raport trasy";
        dom.routeReportSummary.innerHTML = [
          '<div class="report-tile wide route-pro-summary-tile"><span>Czy jechać?</span><strong>' + escapeHtml(pro.verdict + " | " + pro.overall + "/100") + '</strong><small>' + escapeHtml(pro.bike) + '</small></div>',
          '<div class="report-tile wide"><span>Ocena</span><strong>' + escapeHtml(labelText) + '</strong></div>',
          '<div class="report-tile"><span>Dystans / czas</span><strong>' + totalKm.toFixed(1) + ' km / ' + formatRideTime(totalKm) + '</strong></div>',
          '<div class="report-tile"><span>Przewyższenia</span><strong>+' + Math.round(stats.ascentM || 0) + ' m / max ' + (stats.maxGrade || 0).toFixed(1) + '%</strong></div>',
          '<div class="report-tile"><span>Podjazdy / zjazdy</span><strong>' + (analysis.climbs || []).length + ' / ' + (analysis.descents || []).length + '</strong></div>',
          '<div class="report-tile"><span>Asfalt / szuter</span><strong>' + (stats.osmAvailable ? Math.round(totalKm ? pavedKm / totalKm * 100 : 0) + '% / ' + Math.round(totalKm ? unpavedKm / totalKm * 100 : 0) + '%' : 'brak OSM') + '</strong></div>',
          '<div class="report-tile"><span>Las / drogi główne</span><strong>' + routePercentCell(forestKm, totalKm) + ' / ' + routePercentCell(mainKm, totalKm) + '</strong></div>'
        ].join("");
        dom.routeReportDetails.innerHTML = [
          '<div class="route-pro-hero ' + proScoreState(pro.overall) + '"><span>Raport PRO</span><strong>' + escapeHtml(pro.verdict + " - " + pro.overall + "/100") + '</strong><em>Rower: ' + escapeHtml(pro.bike) + '</em></div>',
          routeProScoreHtml(pro),
          '<div class="report-section-title">Ostrzeżenia PRO po kilometrach</div>',
          routeProWarningsHtml(pro),
          '<div class="route-verdict"><strong>Werdykt rowerzysty</strong><span>' + escapeHtml("Trasa ma " + totalKm.toFixed(1) + " km, " + (analysis.climbs || []).length + " wykrytych podjazdów i " + (analysis.descents || []).length + " zjazdów. " + (analysis.worstClimb ? "Najmocniejszy podjazd jest na " + kmRangeText(analysis.worstClimb) + " i ma max " + analysis.worstClimb.maxGrade.toFixed(1) + "%. " : "Nie widać jednego mocnego podjazdu. ") + (stats.osmAvailable ? "Asfalt/twarde: " + routePercentCell(pavedKm, totalKm) + ", szuter/grunt: " + routePercentCell(unpavedKm, totalKm) + ", las: " + routePercentCell(forestKm, totalKm) + "." : "Nawierzchnia bez pełnej analizy OSM.")) + '</span></div>',
          '<div class="report-section-title">Najważniejsze liczby</div>',
          '<table class="route-report-table"><tbody>',
          '<tr><th>Podjazdy</th><td>' + (analysis.climbs || []).length + ' szt., razem +' + Math.round(analysis.climbGainM || stats.ascentM || 0) + ' m, ' + (analysis.climbKm || 0).toFixed(1) + ' km jazdy pod górę</td></tr>',
          '<tr><th>Zjazdy</th><td>' + (analysis.descents || []).length + ' szt., razem -' + Math.round(analysis.descentDropM || 0) + ' m, ' + (analysis.descentKm || 0).toFixed(1) + ' km zjazdów</td></tr>',
          '<tr><th>Najmocniejszy podjazd</th><td>' + escapeHtml(analysis.worstClimb ? kmRangeText(analysis.worstClimb) + ', +' + Math.round(analysis.worstClimb.gainM) + ' m, dł. ' + analysis.worstClimb.distanceKm.toFixed(1) + ' km, max ' + analysis.worstClimb.maxGrade.toFixed(1) + '%, ' + (analysis.worstClimb.difficulty || 'podjazd') : 'brak wyraźnego mocnego podjazdu') + '</td></tr>',
          '<tr><th>Najmocniejszy zjazd</th><td>' + escapeHtml(analysis.worstDescent ? kmRangeText(analysis.worstDescent) + ', -' + Math.round(analysis.worstDescent.dropM) + ' m, dł. ' + analysis.worstDescent.distanceKm.toFixed(1) + ' km, max ' + analysis.worstDescent.maxGrade.toFixed(1) + '%, ' + (analysis.worstDescent.difficulty || 'zjazd') : 'brak wyraźnego stromego zjazdu') + '</td></tr>',
          '<tr><th>Najgorsza droga</th><td>' + escapeHtml(analysis.worstRoad ? kmRangeText(analysis.worstRoad) + ' - ' + analysis.worstRoad.reasonText : 'brak mocnych ostrzeżeń z OSM') + '</td></tr>',
          '<tr><th>Pogoda</th><td>' + escapeHtml(weather.summary) + '</td></tr>',
          '</tbody></table>',
          '<div class="report-section-title">Udział dróg i nawierzchni</div>',
          '<table class="route-report-table"><thead><tr><th>Rodzaj</th><th>Udział</th><th>Znaczenie</th></tr></thead><tbody>',
          '<tr><td>Asfalt / twarde</td><td>' + (stats.osmAvailable ? routePercentCell(pavedKm, totalKm) : 'brak OSM') + '</td><td>najbardziej przewidywalne pod szosę/gravel</td></tr>',
          '<tr><td>Lokalne / rowerowe</td><td>' + (stats.osmAvailable ? routePercentCell(localBikeKm, totalKm) : 'brak OSM') + '</td><td>zwykle spokojniejsze dla rowerzysty</td></tr>',
          '<tr><td>Szuter / grunt</td><td>' + routePercentCell(unpavedKm, totalKm) + '</td><td>ryzyko piachu, błota lub wolniejszej jazdy</td></tr>',
          '<tr><td>Las razem</td><td>' + routePercentCell(forestKm, totalKm) + '</td><td>w lesie nawierzchnia może być różna</td></tr>',
          '<tr><td>Las + grunt</td><td>' + routePercentCell(stats.forestUnpavedKm || 0, totalKm) + '</td><td>największe ryzyko trudnego przejazdu</td></tr>',
          '<tr><td>DK / DW / szybkie</td><td>' + routePercentCell(mainKm, totalKm) + '</td><td>sprawdź ruch i pobocze</td></tr>',
          '<tr><td>Niepewne OSM</td><td>' + routePercentCell(unknownKm, totalKm) + '</td><td>warto sprawdzić satelitę lub ręcznie poprawić</td></tr>',
          '</tbody></table>',
          '<div class="report-section-title">Podjazdy - top odcinki</div>',
          '<table class="route-report-table compact"><thead><tr><th>#</th><th>Km</th><th>Długość</th><th>Przew.</th><th>Max</th></tr></thead><tbody>' + routeSegmentRows(analysis.climbs, "climb") + '</tbody></table>',
          '<div class="report-section-title">Zjazdy - top odcinki</div>',
          '<table class="route-report-table compact"><thead><tr><th>#</th><th>Km</th><th>Długość</th><th>Spadek</th><th>Max</th></tr></thead><tbody>' + routeSegmentRows(analysis.descents, "descent") + '</tbody></table>',
          '<div class="report-section-title">Jak się przygotować</div>',
          '<ul class="report-recommendations route-prep-list">' + tips.map((item) => '<li>' + escapeHtml(item) + '</li>').join("") + '</ul>'
        ].join("");
        dom.routeWarningList.innerHTML = buildRouteWarnings().map((item) => '<div class="report-item ' + (item.level === "bad" ? "bad" : item.level === "warn" ? "warn" : "") + '">' + escapeHtml(item.text) + "</div>").join("");
        if (dom.routeNearbyList) dom.routeNearbyList.innerHTML = routeNearbyHtml(totalKm, state.routeFoodShops || [], state.routeAttractions || [], state.routeLodgings || []);
        dom.routeStopList.innerHTML = weather.rows.map((row) => '<div class="report-item"><strong>' + escapeHtml(row.label + ': ' + row.value) + '</strong><br>' + escapeHtml(row.note) + '</div>').join("");
      }

      function openRouteQualityReport() {
        renderRouteQualityModal();
        dom.routeReportPanel.classList.add("route-quality-modal", "visible");
      }
      function renderRouteReport(title) {
        const stats = state.stats || {};
        const shops = state.routeFoodShops || [];
        const attractions = state.routeAttractions || [];
        const lodgings = state.routeLodgings || [];
        const warnings = buildRouteWarnings();
        const details = buildRouteQualityDetails(stats, shops);
        const analysis = details.analysis || {};
        const worstClimb = analysis.worstClimb;
        const worstRoad = analysis.worstRoad;
        const totalKm = analysis.totalKm || stats.distanceKm || routeDistanceKm(state.routeLatLngs) || 0;
        const pavedKm = stats.osmAvailable ? (stats.pavedKm || 0) : 0;
        const unpavedForestKm = (stats.unpavedKm || 0) + (stats.forestUnpavedKm || 0);
        state.routeWarnings = warnings;
        dom.routeReportTitle.textContent = title || "Co jest przy trasie";
        dom.routeReportSummary.innerHTML = [
          '<div class="report-tile"><span>Podjazdy</span><strong>' + ((analysis.climbs || []).length || 0) + ' szt. / +' + Math.round(analysis.climbGainM || 0) + ' m</strong></div>',
          '<div class="report-tile"><span>Zjazdy</span><strong>' + ((analysis.descents || []).length || 0) + ' szt. / -' + Math.round(analysis.descentDropM || 0) + ' m</strong></div>',
          '<div class="report-tile"><span>Najmocniejszy podjazd</span><strong>' + escapeHtml(worstClimb ? kmRangeText(worstClimb) + ' / ' + worstClimb.maxGrade.toFixed(1) + '%' : 'brak') + '</strong></div>',
          '<div class="report-tile"><span>Najgorsza droga</span><strong>' + escapeHtml(worstRoad ? kmRangeText(worstRoad) : 'brak') + '</strong></div>',
          '<div class="report-tile"><span>Asfalt / twarde</span><strong>' + (stats.osmAvailable ? pavedKm.toFixed(1) + ' km / ' + Math.round(totalKm ? pavedKm / totalKm * 100 : 0) + '%' : 'brak OSM') + '</strong></div>',
          '<div class="report-tile"><span>Szuter + las grunt</span><strong>' + unpavedForestKm.toFixed(1) + ' km</strong></div>',
          '<div class="report-tile"><span>Sklepy / AT / NO</span><strong>' + shops.length + ' / ' + attractions.length + ' / ' + lodgings.length + '</strong></div>'
        ].join("");
        dom.routeReportDetails.innerHTML = [
          '<div class="report-section-title">Kontrola odcinków</div>',
          '<div class="report-quality-grid">',
          details.chips.map((chip) => '<div class="report-chip ' + chip.state + '"><strong>' + escapeHtml(chip.label) + ': ' + escapeHtml(chip.value) + '</strong><span>' + escapeHtml(chip.text) + '</span></div>').join(""),
          '</div>',
          '<div class="report-section-title">Nawierzchnia i przewidywalność</div>',
          '<div class="report-quality-grid">',
          (details.surface && details.surface.chips ? details.surface.chips.map((chip) => '<div class="report-chip ' + chip.state + '"><strong>' + escapeHtml(chip.label) + ': ' + escapeHtml(chip.value) + '</strong><span>' + escapeHtml(chip.text) + '</span></div>').join("") : ""),
          '</div>',
          '<div class="surface-table-wrap">',
          '<table class="surface-table"><thead><tr><th>Rodzaj</th><th>Km</th><th>%</th><th>Uwaga</th></tr></thead><tbody>',
          (details.surface && details.surface.rows ? details.surface.rows.map((row) => '<tr class="' + escapeHtml(row.state || "") + '"><td>' + escapeHtml(row.label) + '</td><td>' + (Number(row.km) || 0).toFixed(1) + '</td><td>' + Math.round(Number(row.percent) || 0) + '%</td><td>' + escapeHtml(row.note || "") + '</td></tr>').join("") : '<tr><td colspan="4">Brak danych nawierzchni. Włącz analizę OSM albo przelicz trasę.</td></tr>'),
          '</tbody></table>',
          '<div class="surface-table-note">Uwaga: kategorie mogą się nakładać, bo jedna droga może być jednocześnie asfaltowa, lokalna, rowerowa albo przebiegać przez las.</div>',
          '</div>',
          '<ul class="report-recommendations">',
          (details.surface && details.surface.notes ? details.surface.notes.map((item) => '<li>' + escapeHtml(item) + '</li>').join("") : ""),
          '</ul>',
          '<div class="report-section-title">Podjazdy - gdzie i ile</div>',
          segmentCardsHtml(analysis.climbs, "climb", "Brak wyraźnych podjazdów. Profil wygląda łagodnie."),
          '<div class="report-section-title">Zjazdy - gdzie i ile</div>',
          segmentCardsHtml(analysis.descents, "descent", "Brak wyraźnych stromych zjazdów."),
          '<div class="report-section-title">Co poprawić / co jest OK</div>',
          '<ul class="report-recommendations">',
          details.recommendations.map((item) => '<li>' + escapeHtml(item) + '</li>').join(""),
          '</ul>'
        ].join("");
        const hotspots = buildRouteHotspotItems(analysis);
        const manualItems = buildManualCorrectionItems();
        dom.routeReportDetails.insertAdjacentHTML("beforeend", [
          '<div class="report-section-title">Trudne miejsca na mapie</div>',
          hotspotHtml(hotspots, "Brak wyraźnych trudnych miejsc według profilu i OSM."),
          '<div class="report-section-title">Ręczne korekty</div>',
          hotspotHtml(manualItems, "Brak ręcznych korekt. Włącz Korekta i kliknij odcinek trasy.")
        ].join(""));
        dom.routeWarningList.innerHTML = warnings.map((item) => '<div class="report-item ' + (item.level === "bad" ? "bad" : item.level === "warn" ? "warn" : "") + '">' + escapeHtml(item.text) + "</div>").join("");
        if (dom.routeNearbyList) dom.routeNearbyList.innerHTML = routeNearbyHtml(analysis.totalKm || 0, shops, attractions, lodgings);
        dom.routeStopList.innerHTML = shops.length || attractions.length
          ? [shops.slice(0, 12).map((shop) => '<div class="stop-item"><strong>SK km ' + shop.distanceAlongKm.toFixed(1) + ' - ' + escapeHtml(shop.name) + '</strong><span>' + escapeHtml(shop.type) + " | " + Math.round(shop.distanceFromRouteKm * 1000) + ' m od trasy</span></div>').join(""), attractions.slice(0, 12).map((item) => '<div class="stop-item attraction"><strong>AT km ' + item.distanceAlongKm.toFixed(1) + ' - ' + escapeHtml(item.name) + '</strong><span>' + escapeHtml(item.type) + " | " + Math.round(item.distanceFromRouteKm * 1000) + ' m od trasy</span></div>').join("")].join("")
          : '<div class="report-item warn">Brak danych. Kliknij „Sklepy trasy” albo „Atrakcje trasy”.</div>';
      }



      function buildFoodPlan(stats, shops) {
        const totalKm = stats.distanceKm || routeDistanceKm(state.routeLatLngs);
        const avgSpeed = Math.max(8, Number(dom.avgSpeed.value) || 20);
        const hours = totalKm / avgSpeed;
        const kcal = calorieEstimate(stats);
        const bottles = Math.max(2, Math.ceil(hours * 0.7));
        const carbsMin = Math.round(hours * 40);
        const carbsMax = Math.round(hours * 65);
        const gaps = routeShopGaps(shops || [], totalKm);
        const maxGap = gaps.reduce((best, gap) => Math.max(best, gap.gapKm || 0), 0);
        return {
          hours,
          kcal,
          bottles,
          carbsMin,
          carbsMax,
          maxGap,
          text: [
            "Woda: około " + bottles + " bidony po 0,5-0,75 l; w upał więcej.",
            "Jedzenie: celuj w około " + carbsMin + "-" + carbsMax + " g węglowodanów na całą trasę.",
            "Kalorie orientacyjnie: " + kcal + " kcal, zależnie od tempa, masy, wiatru i nawierzchni.",
            maxGap >= 30 ? "Uwaga: najdłuższy odcinek bez sklepu przy trasie to około " + maxGap.toFixed(0) + " km." : "Sklepy/przerwy wyglądają rozsądnie, jeśli dane OSM są kompletne."
          ]
        };
      }

      function buildEmergencyPlan(stats, analysis, shops, lodgings) {
        const totalKm = stats.distanceKm || routeDistanceKm(state.routeLatLngs);
        const items = [];
        if (!state.routeLatLngs.length) return ["Najpierw wyznacz trasę, wtedy pojawi się plan awaryjny."];
        if (analysis.worstClimb) items.push("Najmocniejszy podjazd: " + kmRangeText(analysis.worstClimb) + ", max " + analysis.worstClimb.maxGrade.toFixed(1) + "%.");
        if (analysis.worstRoad) items.push("Najgorszy odcinek drogi: " + kmRangeText(analysis.worstRoad) + " (" + analysis.worstRoad.reasonText + ").");
        if ((shops || []).length) {
          const midShop = (shops || []).find((shop) => shop.distanceAlongKm >= totalKm * 0.45) || shops[0];
          items.push("Awaryjny sklep/postój: km " + midShop.distanceAlongKm.toFixed(1) + " - " + midShop.name + ".");
        } else {
          items.push("Brak pobranej listy sklepów. Kliknij Sklepy trasy przed dłuższym wyjazdem.");
        }
        if (totalKm >= 120) {
          if ((lodgings || []).length) {
            const lodging = lodgings.find((item) => item.distanceAlongKm >= totalKm * 0.45) || lodgings[0];
            items.push("Nocleg awaryjny w połowie/po trasie: km " + lodging.distanceAlongKm.toFixed(1) + " - " + lodging.name + ".");
          } else {
            items.push("Trasa jest długa. Kliknij Noclegi trasy, żeby mieć opcję awaryjnego noclegu.");
          }
        }
        if ((stats.forestUnpavedKm || 0) > 0.2 || (stats.unpavedKm || 0) > 1) items.push("Weź pod uwagę objazd lub ręczną korektę: OSM wykrywa grunt/szuter.");
        if ((stats.maxGrade || 0) >= 8) items.push("Końcówka z mocnymi podjazdami może mocniej zmęczyć: zostaw zapas jedzenia i picia.");
        return items.slice(0, 7);
      }

      function openTripPlan() {
        const stats = state.stats || {};
        const shops = state.routeFoodShops || [];
        const attractions = state.routeAttractions || [];
        const lodgings = state.routeLodgings || [];
        const details = buildRouteQualityDetails(stats, shops);
        const analysis = details.analysis || routeControlAnalysis(stats, shops);
        const food = buildFoodPlan(stats, shops);
        const emergency = buildEmergencyPlan(stats, analysis, shops, lodgings);
        const topAttractions = attractions.slice(0, 6).map((item) => "km " + item.distanceAlongKm.toFixed(1) + " - " + item.name + " (" + item.type + ")");
        dom.routeReportTitle.textContent = "Plan dnia";
        dom.routeReportSummary.innerHTML = [
          '<div class="report-tile"><span>Jedzenie</span><strong>' + food.carbsMin + '-' + food.carbsMax + ' g</strong></div>',
          '<div class="report-tile"><span>Picie</span><strong>' + food.bottles + ' bid.</strong></div>',
          '<div class="report-tile"><span>Kcal</span><strong>' + food.kcal + '</strong></div>',
          '<div class="report-tile"><span>Atrakcje / noclegi</span><strong>' + attractions.length + ' / ' + lodgings.length + '</strong></div>'
        ].join("");
        dom.routeReportDetails.innerHTML = [
          '<div class="report-section-title">Plan jedzenia i picia</div>',
          '<ul class="report-recommendations">',
          food.text.map((item) => '<li>' + escapeHtml(item) + '</li>').join(""),
          '</ul>',
          '<div class="report-section-title">Plan awaryjny</div>',
          '<ul class="report-recommendations">',
          emergency.map((item) => '<li>' + escapeHtml(item) + '</li>').join(""),
          '</ul>',
          '<div class="report-section-title">Warto zobaczyć</div>',
          '<ul class="report-recommendations">',
          (topAttractions.length ? topAttractions : ["Kliknij Atrakcje trasy, żeby planer znalazł ciekawe miejsca przy śladzie."]).map((item) => '<li>' + escapeHtml(item) + '</li>').join(""),
          '</ul>'
        ].join("");
        dom.routeWarningList.innerHTML = buildRouteWarnings().map((item) => '<div class="report-item ' + (item.level === "bad" ? "bad" : item.level === "warn" ? "warn" : "") + '">' + escapeHtml(item.text) + "</div>").join("");
        if (dom.routeNearbyList) dom.routeNearbyList.innerHTML = routeNearbyHtml(analysis.totalKm || 0, shops, attractions, lodgings);
        dom.routeStopList.innerHTML = lodgings.length
          ? lodgings.slice(0, 12).map((item) => '<div class="stop-item lodging"><strong>NO km ' + item.distanceAlongKm.toFixed(1) + ' - ' + escapeHtml(item.name) + '</strong><span>' + escapeHtml(item.type) + " | " + Math.round(item.distanceFromRouteKm * 1000) + ' m od trasy</span></div>').join("")
          : '<div class="report-item warn">Noclegi niepobrane. Kliknij „Noclegi trasy”, jeśli planujesz dłuższą wyprawę.</div>';
        dom.routeReportPanel.classList.add("visible");
      }

      function openRouteReport(title) {
        dom.routeReportPanel.classList.remove("route-quality-modal");
        renderRouteReport(title);
        dom.routeReportPanel.classList.add("visible");
      }

      async function loadRouteFoodShops() {
        if (!state.routeLatLngs.length) {
          setStatus("Najpierw wyznacz albo wczytaj trasę, potem sprawdzę sklepy przy trasie.", "warn");
          openRouteReport("Kontrola trasy");
          return;
        }
        if (state.busy) return;
        try {
          setBusy(true);
          const totalKm = routeDistanceKm(state.routeLatLngs);
          const chunks = Math.max(1, Math.min(4, Math.ceil(totalKm / 75)));
          configureBusyTimer("Sklepy trasy", chunks * 8);
          let shops = [];
          let failures = 0;
          for (let i = 0; i < chunks; i += 1) {
            const startRatio = i / chunks;
            const endRatio = (i + 1) / chunks;
            setStatus("Szukam sklepów przy trasie: część " + (i + 1) + "/" + chunks + "...");
            const query = chunks === 1
              ? routeShopQuery(state.routeLatLngs, 700)
              : routeShopQueryChunk(state.routeLatLngs, startRatio, endRatio, 700);
            let data = null;
            try {
              data = await fetchOverpass(query, { fast: true, timeoutMs: 8500 });
            } catch (error) {
              failures += 1;
              setStatus("Overpass przerwał część " + (i + 1) + "/" + chunks + ". Próbuję lżejsze wyszukiwanie sklepów...");
              try {
                const fallbackQuery = routeShopPriorityQuery(state.routeLatLngs, startRatio, endRatio, 650);
                data = await fetchOverpass(fallbackQuery, { fast: false, timeoutMs: 13000 });
              } catch (fallbackError) {
                failures += 1;
                continue;
              }
            }
            const chunkShops = shopsFromOverpassElements(data.elements || [], 0.85);
            shops = mergeRouteShops(shops, chunkShops, 0.85);
            state.routeFoodShops = shops;
            drawRouteFoodShops(shops);
            renderRouteReport("Sklepy i kontrola");
          }
          if (!shops.length && failures) {
            const middle = routePointAtDistance(state.routeLatLngs, totalKm * 0.5);
            const middlePoint = middle && middle.point ? middle.point : state.routeLatLngs[Math.floor(state.routeLatLngs.length / 2)];
            if (middlePoint) {
              setStatus("Sklepy trasy: robię awaryjne lekkie wyszukiwanie w środku trasy...");
              try {
                const fallbackData = await fetchOverpass(routeShopAroundPointQuery(middlePoint, 9000), { fast: false, timeoutMs: 14000 });
                shops = mergeRouteShops(shops, shopsFromOverpassElements(fallbackData.elements || [], 1.2), 1.2);
              } catch (fallbackError) {
                failures += 1;
              }
            }
          }
          state.routeFoodShops = shops;
          drawRouteFoodShops(shops);
          openRouteReport("Sklepy i kontrola");
          if (shops.length) {
            const note = failures ? " Część zapytań Overpass była przeciążona, więc pokazuję znalezione wyniki." : "";
            setStatus("Sklepy przy trasie: " + shops.length + ". Dodałem je do mapy, raportu i eksportu GPX." + note);
          } else {
            setStatus(failures ? "Overpass przerwał pobieranie sklepów. Spróbuj ponownie za chwilę albo skróć trasę/zbliż mapę." : "Nie znalazłem sklepów do około 1 km od trasy.", "warn");
          }
        } catch (error) {
          setStatus("Nie udało się pobrać sklepów przy trasie. Overpass może być przeciążony: " + error.message, "warn");
          openRouteReport("Kontrola trasy");
        } finally {
          setBusy(false);
        }
      }



      async function loadRouteAttractions() {
        if (!state.routeLatLngs.length) {
          setStatus("Najpierw wyznacz albo wczytaj trasę, potem sprawdzę atrakcje przy trasie.", "warn");
          openRouteReport("Co jest przy trasie");
          return;
        }
        if (state.busy) return;
        try {
          setBusy(true);
          const totalKm = routeDistanceKm(state.routeLatLngs);
          const chunks = totalKm > 170 ? 2 : 1;
          configureBusyTimer("Atrakcje trasy", chunks > 1 ? 16 : 9);
          let attractions = [];
          for (let i = 0; i < chunks; i += 1) {
            const startRatio = i / chunks;
            const endRatio = (i + 1) / chunks;
            setStatus("Szukam atrakcji przy trasie: część " + (i + 1) + "/" + chunks + "...");
            const query = chunks === 1
              ? routeAttractionQuery(state.routeLatLngs, 950)
              : routeAttractionQueryChunk(state.routeLatLngs, startRatio, endRatio, 950);
            const data = await fetchOverpass(query, { fast: true, timeoutMs: 11000 });
            const chunkAttractions = attractionsFromOverpassElements(data.elements || [], 1.1);
            attractions = mergeRouteAttractions(attractions, chunkAttractions, 1.1);
            state.routeAttractions = attractions;
            drawRouteAttractions(attractions);
            renderRouteReport("Co jest przy trasie");
          }
          state.routeAttractions = attractions;
          drawRouteAttractions(attractions);
          openRouteReport("Co jest przy trasie");
          setStatus(attractions.length ? "Atrakcje przy trasie: " + attractions.length + ". Dodałem je do mapy i raportu." : "Nie znalazłem atrakcji do około 1 km od trasy.", attractions.length ? "" : "warn");
        } catch (error) {
          setStatus("Nie udało się pobrać atrakcji przy trasie: " + error.message, "warn");
          openRouteReport("Co jest przy trasie");
        } finally {
          setBusy(false);
        }
      }

      function markerIcon(index) {
        const isStart = index === 0;
        const isFinish = isPointMode() && !isWaypointLoop() && index > 0 && index === state.waypoints.length - 1;
        const locked = state.lockedWaypoints.has(index);
        return L.divIcon({
          className: "",
          html: '<div class="waypoint-icon' + (isStart ? " start" : "") + (isFinish ? " finish" : "") + (locked ? " locked" : "") + '">' + (isStart ? "S" : isFinish ? "M" : index) + "</div>",
          iconSize: isStart ? [30, 30] : [24, 24],
          iconAnchor: isStart ? [15, 15] : [12, 12]
        });
      }

      function clearMarkers() {
        for (const marker of state.markers) {
          marker.remove();
        }
        state.markers = [];
      }

      function normalizeLockedWaypoints() {
        const maxIndex = Math.max(0, editableWaypointCount() - 1);
        for (const index of Array.from(state.lockedWaypoints)) {
          if (index <= 0 || index > maxIndex) {
            state.lockedWaypoints.delete(index);
          }
        }
      }

      function shiftLockedWaypointsAfterRemoval(removedIndex) {
        const next = new Set();
        for (const index of state.lockedWaypoints) {
          if (index < removedIndex) next.add(index);
          else if (index > removedIndex) next.add(index - 1);
        }
        state.lockedWaypoints = next;
      }

      function toggleWaypointLock(index) {
        if (index <= 0) return;
        if (state.lockedWaypoints.has(index)) {
          state.lockedWaypoints.delete(index);
          setStatus("Punkt #" + index + " odblokowany. Możesz go przeciągnąć albo usunąć.");
        } else {
          state.lockedWaypoints.add(index);
          setStatus("Punkt #" + index + " zablokowany. Generator i edycja ręczna zostawią go jako kotwicę.");
        }
        redrawMarkers();
      }

      function isWaypointLoop() {
        return state.waypoints.length >= 2 && haversineKm(state.waypoints[0], state.waypoints[state.waypoints.length - 1]) < 0.08;
      }

      function editableWaypointCount() {
        if (!state.waypoints.length) return 0;
        return isWaypointLoop() ? Math.max(1, state.waypoints.length - 1) : state.waypoints.length;
      }

      function redrawMarkers() {
        clearMarkers();
        normalizeLockedWaypoints();
        const visible = state.waypoints.slice(0, editableWaypointCount());
        async function removeWaypoint(indexToRemove) {
          if (indexToRemove === 0) return;
          if (isPointMode() && state.finish && indexToRemove === state.waypoints.length - 1) {
            setStatus("Meta jest końcem trasy A→B. Ustaw inną metę zamiast usuwać ten punkt.", "warn");
            return;
          }
          if (state.lockedWaypoints.has(indexToRemove)) {
            setStatus("Ten punkt jest zablokowany. Najpierw kliknij punkt i użyj Odblokuj.", "warn");
            return;
          }
          if (state.waypoints.length <= 2) {
            if (isCustomMode()) {
              state.waypoints.splice(indexToRemove, 1);
              discardCurrentRouteVisuals(false);
              redrawMarkers();
              drawGuide(state.waypoints, false);
              setStatus("Punkt własnej trasy usunięty. Kliknij mapę, żeby dodać kolejny punkt.");
              return;
            }
            setStatus("Trasa musi mieć przynajmniej start i koniec.", "warn");
            return;
          }
          const wasLoop = isWaypointLoop();
          state.waypoints.splice(indexToRemove, 1);
          shiftLockedWaypointsAfterRemoval(indexToRemove);
          if (wasLoop) state.waypoints[state.waypoints.length - 1] = state.start;
          redrawMarkers();
          await routeCurrentWaypoints("Punkt usunięty i trasa przeliczona.");
        }
        visible.forEach((latlng, index) => {
          const marker = L.marker(latlng, {
            draggable: index === 0 || !state.lockedWaypoints.has(index),
            icon: markerIcon(index)
          }).addTo(map);

          if (index > 0) {
            const locked = state.lockedWaypoints.has(index);
            marker.bindPopup([
              '<div class="popup-tools">',
              '<strong>Punkt ' + index + '</strong>',
              '<span>Przeciągnij, usuń prawym kliknięciem albo dwuklikiem.</span>',
              '<button type="button" class="popup-delete popup-remove" data-index="' + index + '">Usuń punkt</button>',
              '<button type="button" class="popup-delete popup-lock" data-index="' + index + '">' + (locked ? "Odblokuj" : "Zablokuj") + '</button>',
              '<button type="button" class="popup-delete popup-move" data-index="' + index + '">Przesuń</button>',
              '</div>'
            ].join(""));
            marker.on("popupopen", () => {
              const popup = marker.getPopup().getElement();
              const removeButton = popup.querySelector(".popup-remove");
              const lockButton = popup.querySelector(".popup-lock");
              const moveButton = popup.querySelector(".popup-move");
              if (removeButton) removeButton.addEventListener("click", () => removeWaypoint(index));
              if (lockButton) lockButton.addEventListener("click", () => toggleWaypointLock(index));
              if (moveButton) moveButton.addEventListener("click", () => {
                if (state.lockedWaypoints.has(index)) {
                  setStatus("Punkt jest zablokowany. Odblokuj go, żeby przesunąć.", "warn");
                } else {
                  marker.closePopup();
                  setStatus("Przeciągnij punkt #" + index + " w nowe miejsce.");
                }
              });
            });
            marker.on("contextmenu", () => removeWaypoint(index));
          }

          marker.on("dragend", async () => {
            if (index > 0 && state.lockedWaypoints.has(index)) {
              marker.setLatLng(state.waypoints[index]);
              setStatus("Punkt #" + index + " jest zablokowany.", "warn");
              return;
            }
          const next = marker.getLatLng();
          const movedFinishInPointMode = isPointMode() && index === state.waypoints.length - 1;
          if (index === 0) {
            const wasLoop = isWaypointLoop();
            state.start = next;
            state.waypoints[0] = next;
            if (wasLoop) state.waypoints[state.waypoints.length - 1] = next;
          } else if (movedFinishInPointMode) {
            state.finish = next;
            state.lockedWaypoints.clear();
            state.waypoints = [state.start, state.finish];
          } else {
            state.waypoints[index] = next;
          }
            syncLabels();
            redrawMarkers();
            if (movedFinishInPointMode && dom.autoReroute.checked) {
              drawGuide(state.waypoints, true);
              await findPointRoute();
            } else if (dom.autoReroute.checked) {
              await routeCurrentWaypoints("Trasa przeliczona po przeciągnięciu punktu.");
            } else {
              drawGuide(state.waypoints, false);
              setStatus(movedFinishInPointMode ? "Meta przesunięta. Stare objazdy wyczyszczone. Kliknij „Szukaj trasy A→B” albo „Przelicz z punktów”." : "Punkt przesunięty. Kliknij „Przelicz z punktów”.", "warn");
            }
          });

          marker.on("dblclick", async () => {
            await removeWaypoint(index);
          });

          state.markers.push(marker);
        });
      }

      function insertionIndexForPoint(latlng) {
        if (state.waypoints.length < 2) return 1;
        let bestIndex = 1;
        let bestDistance = Infinity;
        for (let i = 0; i < state.waypoints.length - 1; i += 1) {
          const distanceKm = distancePointToSegmentKm(latlng, state.waypoints[i], state.waypoints[i + 1]);
          if (distanceKm < bestDistance) {
            bestDistance = distanceKm;
            bestIndex = i + 1;
          }
        }
        return clamp(bestIndex, 1, state.waypoints.length - 1);
      }

      function insertPointOnRoute(latlng) {
        if (!state.routeLatLngs.length) {
          setStatus("Najpierw wyznacz trasę, potem kliknij jej zieloną linię.", "warn");
          return -1;
        }
        const point = L.latLng(latlng.lat, latlng.lng);
        const index = insertionIndexForPoint(point);
        state.waypoints.splice(index, 0, point);
        redrawMarkers();
        setStatus("Punkt wstawiony w przebieg pętli jako #" + index + ". Przeciągnij go, a trasa zawinie się przez nowe miejsce.");
        return index;
      }

      function startLineDrag(index, originalEvent) {
        const marker = state.markers[index];
        if (!marker) return;
        let moved = false;
        map.dragging.disable();

        const move = (event) => {
          moved = true;
          const point = L.latLng(event.latlng.lat, event.latlng.lng);
          state.waypoints[index] = point;
          marker.setLatLng(point);
        };

        const finish = async () => {
          map.off("mousemove", move);
          map.off("mouseup", finish);
          map.dragging.enable();
          redrawMarkers();
          if (moved && dom.autoReroute.checked) {
            await routeCurrentWaypoints("Trasa zawinięta przez przeciągnięty fragment.");
          } else if (moved) {
            setStatus("Fragment przesunięty. Kliknij „Przelicz z punktów”, żeby odświeżyć trasę.", "warn");
          } else {
            setStatus("Punkt wstawiony na linii trasy. Przeciągnij go albo kliknij „Przelicz z punktów”.");
          }
        };

        map.on("mousemove", move);
        map.on("mouseup", finish);
        if (originalEvent) L.DomEvent.stop(originalEvent);
      }

      function setStart(latlng, label, options) {
        clearWeatherData();
        clearRouteAnalysisData();
        if (state.routeLatLngs.length >= 8) {
          state.previousRouteLatLngs = state.routeLatLngs.slice();
          state.avoidPreviousRoute = true;
        }
        state.routeSearchNonce += 1;
        state.start = L.latLng(latlng.lat, latlng.lng);
        state.lockedWaypoints.clear();
        state.profileRequestId += 1;
        updateRadiusCircle();
        state.waypoints = isCustomMode() ? [state.start] : (isPointMode() && state.finish ? [state.start, state.finish] : [state.start, state.start]);
        state.routeLatLngs = [];
        state.routeDistances = [];
        state.guideLatLngs = [];
        state.profileLatLngs = [];
        state.profileDistances = [];
        state.profileElevations = [];
        state.profileSmoothElevations = [];
        state.profileHoverIndex = -1;
        resetProfileZoom();
        routeHoverMarker.setStyle({ opacity: 0, fillOpacity: 0 });
        routeLayer.clearLayers();
        routeShadeLayer.clearLayers();
        routeDirectionLayer.clearLayers();
        climbBadgeLayer.clearLayers();
        fatigueBadgeLayer.clearLayers();
        foodShopLayer.clearLayers();
        routeFoodShopLayer.clearLayers();
        routeAttractionLayer.clearLayers();
        routeLodgingLayer.clearLayers();
        attractionLayer.clearLayers();
        attractionLayer.clearLayers();
        plannedBreakLayer.clearLayers();
        manualCorrectionLayer.clearLayers();
        routeHitLayer.clearLayers();
        guideLayer.setLatLngs([]);
        updateMetrics(null, "OSM");
        drawProfile([]);
        redrawMarkers();
        if (!options || !options.keepView) {
          map.setView(state.start, Math.max(map.getZoom(), 12));
        }
        setStatus(label || "Start ustawiony.");
      }

      function setFinish(latlng, label, options) {
        clearWeatherData();
        clearRouteAnalysisData();
        state.routeSearchNonce += 1;
        state.finish = L.latLng(latlng.lat, latlng.lng);
        if (dom.routeMode.value !== "point") dom.routeMode.value = "point";
        state.lockedWaypoints.clear();
        state.profileRequestId += 1;
        state.waypoints = [state.start, state.finish];
        state.routeLatLngs = [];
        state.routeDistances = [];
        state.guideLatLngs = [];
        state.profileLatLngs = [];
        state.profileDistances = [];
        state.profileElevations = [];
        state.profileSmoothElevations = [];
        state.profileHoverIndex = -1;
        resetProfileZoom();
        routeHoverMarker.setStyle({ opacity: 0, fillOpacity: 0 });
        routeLayer.clearLayers();
        routeShadeLayer.clearLayers();
        routeDirectionLayer.clearLayers();
        climbBadgeLayer.clearLayers();
        fatigueBadgeLayer.clearLayers();
        foodShopLayer.clearLayers();
        routeFoodShopLayer.clearLayers();
        routeAttractionLayer.clearLayers();
        routeLodgingLayer.clearLayers();
        attractionLayer.clearLayers();
        attractionLayer.clearLayers();
        plannedBreakLayer.clearLayers();
        manualCorrectionLayer.clearLayers();
        routeHitLayer.clearLayers();
        guideLayer.setLatLngs(state.waypoints);
        updateMetrics(null, "OSM");
        drawProfile([]);
        redrawMarkers();
        syncRouteModeControls();
        if (!options || !options.keepView) {
          map.fitBounds(L.latLngBounds(state.waypoints).pad(0.25));
        }
        setStatus(label || "Meta ustawiona. Kliknij Szukaj trasy A→B.");
      }

      function openFinishRoutePopup(latlng) {
        const directKm = state.finish ? haversineKm(state.start, state.finish) : haversineKm(state.start, latlng);
        const targetKm = Number(dom.targetKm.value) || 0;
        const targetText = targetKm ? "Cel: " + targetKm.toFixed(0) + " km. " : "";
        const popup = L.popup({
          className: "finish-route-popup",
          closeButton: true,
          autoClose: true,
          closeOnClick: false
        })
          .setLatLng(latlng)
          .setContent([
            '<div class="finish-popup">',
            '<strong>Meta ustawiona</strong>',
            '<span>' + targetText + 'Linia prosta S→M: ' + directKm.toFixed(1) + ' km.</span>',
            '<button type="button" class="button blue popup-route-shortest">Opcja 1: najbliższa S→M</button>',
            '<button type="button" class="button popup-route-target">Opcja 2: według dystansu</button>',
            '</div>'
          ].join(""))
          .openOn(map);

        window.setTimeout(() => {
          const element = popup.getElement();
          const shortestButton = element && element.querySelector(".popup-route-shortest");
          const targetButton = element && element.querySelector(".popup-route-target");
          if (shortestButton) {
            shortestButton.addEventListener("click", () => {
              map.closePopup(popup);
              routeShortestPointToPoint();
            });
          }
          if (targetButton) {
            targetButton.addEventListener("click", () => {
              map.closePopup(popup);
              planRouteByMode();
            });
          }
        }, 0);
      }

      function drawGuide(points, show) {
        state.guideLatLngs = points.map((point) => L.latLng(point.lat, point.lng));
        guideLayer.setLatLngs(show ? state.guideLatLngs : []);
      }

      function rememberCurrentRouteForAvoidance() {
        if (state.routeLatLngs.length >= 8) {
          state.previousRouteLatLngs = state.routeLatLngs.slice();
          state.avoidPreviousRoute = true;
        }
      }

      function discardCurrentRouteVisuals(resetWaypoints) {
        if (typeof stopAutoPlay === "function") stopAutoPlay(true);
        clearWeatherData();
        clearRouteAnalysisData();
        cancelCustomRouteTimer();
        rememberCurrentRouteForAvoidance();
        state.profileRequestId += 1;
        state.routeLatLngs = [];
        state.routeDistances = [];
        state.guideLatLngs = [];
        state.profileLatLngs = [];
        state.profileDistances = [];
        state.profileElevations = [];
        state.profileSmoothElevations = [];
        state.profileHoverIndex = -1;
        resetProfileZoom();
        state.stats = null;
        state.variantChoices = [];
        state.activeVariantIndex = -1;
        dom.variantPanel.classList.remove("visible");
        dom.showVariantsBtn.classList.remove("visible");
        dom.variantList.innerHTML = "";
        if (resetWaypoints) {
          resetWaypointsForMode();
        }
        routeHoverMarker.setStyle({ opacity: 0, fillOpacity: 0 });
        routeLayer.clearLayers();
        routeShadeLayer.clearLayers();
        routeDirectionLayer.clearLayers();
        climbBadgeLayer.clearLayers();
        fatigueBadgeLayer.clearLayers();
        foodShopLayer.clearLayers();
        routeFoodShopLayer.clearLayers();
        routeAttractionLayer.clearLayers();
        routeLodgingLayer.clearLayers();
        attractionLayer.clearLayers();
        attractionLayer.clearLayers();
        plannedBreakLayer.clearLayers();
        manualCorrectionLayer.clearLayers();
        routeHitLayer.clearLayers();
        guideLayer.setLatLngs([]);
        updateMetrics(null, "OSM");
        drawProfile([]);
      }

      function previewNextLoopSketch() {
        guideLayer.setLatLngs([]);
      }

      function markRouteRulesChanged(message) {
        state.routeSearchNonce += 1;
        discardCurrentRouteVisuals(true);
        if (isCustomMode()) {
          drawGuide(state.waypoints, false);
          setStatus(message + " Tryb Własna trasa nie używa generatora; klikaj punkty na mapie albo użyj Przelicz własną trasę.", "warn");
        } else if (isPointMode() && state.finish) {
          drawGuide(state.waypoints, true);
          setStatus(message + " Kliknij Szukaj trasy A→B, żeby policzyć trasę od nowa.", "warn");
        } else {
          setStatus(message + " Kliknij Szukaj płaskiej pętli, żeby policzyć trasę od nowa.", "warn");
        }
      }

      function setRoute(routeLatLngs, stats, source) {
        clearWeatherData();
        state.routeFoodShops = [];
        state.routeAttractions = [];
        state.routeLodgings = [];
        state.routeWarnings = [];
        state.manualCorrections = [];
        state.manualCorrectionId = 0;
        state.pendingCorrection = null;
        state.manualCorrectionMode = false;
        if (dom.correctionPanel) dom.correctionPanel.classList.remove("visible");
        syncManualCorrectionButtons();
        state.routeLatLngs = routeLatLngs;
        state.routeDistances = routeLatLngs && routeLatLngs.length ? routeSampleDistances(routeLatLngs) : [];
        state.stats = stats;
        state.profileElevations = stats ? stats.elevations || [] : [];
        const profilePointCount = state.profileElevations.length || Math.min(180, Math.max(2, routeLatLngs.length));
        state.profileLatLngs = routeLatLngs.length ? sampleRoute(routeLatLngs, profilePointCount) : [];
        state.profileDistances = [];
        let profileDistance = 0;
        for (let i = 0; i < state.profileLatLngs.length; i += 1) {
          if (i > 0) profileDistance += haversineKm(state.profileLatLngs[i - 1], state.profileLatLngs[i]);
          state.profileDistances.push(profileDistance);
        }
        state.profileSmoothElevations = stats && Array.isArray(stats.smoothElevations) && stats.smoothElevations.length === state.profileElevations.length
          ? stats.smoothElevations.slice()
          : smoothedElevationSeries(state.profileElevations, state.profileDistances);
        state.profileHoverIndex = -1;
        state.profileZoom = 1;
        state.profileZoomCenter = 0.5;
        updateProfileZoomLabel();
        routeHoverMarker.setStyle({ opacity: 0, fillOpacity: 0 });
        routeLayer.clearLayers();
        routeShadeLayer.clearLayers();
        routeDirectionLayer.clearLayers();
        climbBadgeLayer.clearLayers();
        fatigueBadgeLayer.clearLayers();
        plannedBreakLayer.clearLayers();
        manualCorrectionLayer.clearLayers();
        routeHitLayer.clearLayers();
        guideLayer.setLatLngs([]);
        if (routeLatLngs.length) {
          const routeFeature = {
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: routeLatLngs.map((p) => [p.lng, p.lat])
            }
          };
          routeLayer.addData(routeFeature);
          routeHitLayer.addData(routeFeature);
        }
        const risk = stats ? (stats.roadRiskPercent || 0) + (stats.maxGrade > (Number(dom.maxGrade.value) || 4) ? 18 : 0) : 0;
        routeLayer.setStyle({
          color: risk > 45 ? "#ff2fb2" : risk > 24 ? "#ff9f1c" : "#2f86ff"
        });
        drawRouteShading(routeLatLngs, stats);
        if (routeHitLayer.bringToFront) routeHitLayer.bringToFront();
        if (guideLayer.bringToFront) guideLayer.bringToFront();
        drawManualCorrections();
        updateMetrics(stats, source);
        drawProfile(state.profileElevations);
        drawClimbBadges();
        drawFatigueBadges();
        drawPlannedBreaks();
        renderRouteReport("Kontrola trasy");
        scheduleBikeAnalyzerProfilePush("auto");
      }

      function routeLooksClosed(routeLatLngs) {
        return routeLatLngs && routeLatLngs.length >= 3 && haversineKm(routeLatLngs[0], routeLatLngs[routeLatLngs.length - 1]) < 0.25;
      }

      function osmStatsOnly(stats) {
        const base = emptyOsmStats();
        const result = {};
        for (const key of Object.keys(base)) {
          if (stats && Object.prototype.hasOwnProperty.call(stats, key)) result[key] = stats[key];
        }
        if (stats && Array.isArray(stats.roadSamples)) {
          result.roadSamples = stats.roadSamples.slice().reverse();
        }
        return result;
      }

      function reverseCurrentRoute() {
        if (!state.routeLatLngs || state.routeLatLngs.length < 2 || !state.stats) {
          setStatus("Najpierw wyznacz albo wczytaj trasę, potem odwróć kierunek.", "warn");
          return;
        }
        const closed = routeLooksClosed(state.routeLatLngs);
        const reversedRoute = state.routeLatLngs.slice().reverse();
        const sourceElevations = state.stats.elevations && state.stats.elevations.length
          ? state.stats.elevations
          : state.profileElevations;
        const reversedElevations = sourceElevations && sourceElevations.length ? sourceElevations.slice().reverse() : [];
        const reversedStats = measureStats(
          reversedRoute,
          state.stats.distanceKm || routeDistanceKm(reversedRoute),
          reversedElevations,
          osmStatsOnly(state.stats)
        );
        reversedStats.elevationEstimated = !!state.stats.elevationEstimated;
        state.routeSearchNonce += 1;
        setRoute(reversedRoute, reversedStats, "Odwrócony");
        setStatus(closed
          ? "Odwrócono kierunek pętli. Ten sam ślad pokazuje teraz podjazdy i zjazdy dla jazdy w drugą stronę."
          : "Odwrócono kierunek śladu. Przy trasie Start-Meta sprawdź znaczniki startu/mety, bo fizyczny ślad jest teraz liczony od końca.", "warn");
      }

      function updateMetrics(stats, source) {
        if (!stats) {
          dom.metricDistance.textContent = "0 km";
          dom.metricDistance.title = "";
          dom.metricTime.textContent = "0:00";
          dom.metricTime.title = "";
          dom.metricAscent.textContent = "0 m";
          dom.metricAscent.title = "";
          dom.metricGrade.textContent = "0.0%";
          dom.metricRadius.textContent = "0 km";
          dom.metricRoadRisk.textContent = "0%";
          dom.metricForest.textContent = "0 km";
          if (dom.metricCalories) dom.metricCalories.textContent = String(calorieEstimate(null));
          dom.profileInfo.textContent = "brak danych";
          dom.qualityBadge.textContent = "Jakość trasy - brak";
          dom.qualityBadge.className = "quality-badge";
          if (dom.qualityHelp) {
            const emptyTip = "Jakość trasy - brak: najpierw wyznacz albo wczytaj trasę. Potem ocena opisze, czy profil jest łagodny, gdzie są mocne podjazdy, czy dystans jest blisko celu oraz czy OSM wykrywa las, grunt/szuter albo ryzykowne drogi.";
            dom.qualityHelp.setAttribute("data-tip", emptyTip);
            dom.qualityHelp.setAttribute("title", emptyTip);
          }
          refreshMenuSummary();
          return;
        }
        const laps = getLapCount();
        const trainingKm = routeTrainingKm(stats);
        const trainingAscent = (stats.ascentM || 0) * laps;
        dom.metricDistance.textContent = trainingKm.toFixed(1) + " km";
        dom.metricDistance.title = laps > 1 ? "Jedna pętla: " + stats.distanceKm.toFixed(1) + " km x " + laps : "";
        dom.metricTime.textContent = formatRideTime(trainingKm);
        dom.metricTime.title = laps > 1 ? "Czas dla całego treningu: " + laps + " pętli" : "";
        dom.metricAscent.textContent = Math.round(trainingAscent) + " m";
        dom.metricAscent.title = laps > 1 ? "Podjazdy razem: " + Math.round(stats.ascentM || 0) + " m x " + laps : "";
        dom.metricGrade.textContent = stats.maxGrade.toFixed(1) + "%";
        dom.metricRadius.textContent = stats.maxRadiusKm.toFixed(1) + " km";
        dom.metricRoadRisk.textContent = Math.round(stats.roadRiskPercent || 0) + "%";
        dom.metricForest.textContent = (stats.forestKm || 0).toFixed(1) + " km";
        if (dom.metricCalories) {
          const kcal = calorieEstimate(stats);
          const bikeName = dom.bikeType && dom.bikeType.selectedOptions[0] ? dom.bikeType.selectedOptions[0].textContent : "gravel";
          dom.metricCalories.textContent = String(kcal);
          dom.metricCalories.title = "Orientacyjnie: rowerzysta " + (Number(dom.riderWeight.value) || 80) + " kg, rower " + (Number(dom.bikeWeight && dom.bikeWeight.value) || 10) + " kg, " + bikeName + ", średnia " + (Number(dom.avgSpeed.value) || 20) + " km/h; uwzględnia dystans, podjazdy i jakość drogi.";
        }
        const roadInfo = stats.osmAvailable ? " | DK " + (stats.nationalKm || 0).toFixed(1) + " km, DW " + (stats.voivodeshipKm || 0).toFixed(1) + " km, grunt " + (stats.unpavedKm || 0).toFixed(1) + " km" : "";
        const elevationInfo = stats.elevations.length
          ? Math.round(Math.min(...stats.elevations)) + "-" + Math.round(Math.max(...stats.elevations)) + " m" + (stats.elevationEstimated ? " orientacyjnie" : "")
          : "wysokości niedostępne";
        const lapInfo = laps > 1 ? "pętla " + stats.distanceKm.toFixed(1) + " km x " + laps + " = " + trainingKm.toFixed(1) + " km | " : "";
        const repeatNote = laps >= 5 && stats.distanceKm < 15 ? " | krótka pętla: dobra kontrolnie, może być monotonna" : "";
        dom.profileInfo.textContent = lapInfo + elevationInfo + roadInfo + repeatNote;
        updateQualityBadge(stats);
        refreshMenuSummary();
      }

      function updateQualityBadge(stats) {
        const distanceTargetActive = usesDistanceTarget();
        const targetKm = distanceTargetActive ? (Number(dom.targetKm.value) || stats.distanceKm || 1) : (stats.distanceKm || 1);
        const distanceDeltaPercent = distanceTargetActive ? Math.abs(stats.distanceKm - targetKm) / Math.max(targetKm, 1) * 100 : 0;
        let risk = 0;
        risk += distanceDeltaPercent > 18 ? 28 : distanceDeltaPercent > 10 ? 14 : 0;
        risk += Math.min(30, stats.roadRiskPercent || 0);
        risk += Math.min(18, (stats.forestKm || 0) * 2);
        risk += Math.min(18, (stats.unpavedKm || 0) * 3);
        risk += stats.maxGrade > (Number(dom.maxGrade.value) || 4) ? 18 : 0;

        let label = "Dobra";
        let className = "quality-badge good";
        if (risk > 52) {
          label = "Ryzykowna";
          className = "quality-badge bad";
        } else if (risk > 24) {
          label = "Średnia";
          className = "quality-badge medium";
        }

        const reasons = [stats.distanceKm.toFixed(1) + " km"];
        if (distanceTargetActive && distanceDeltaPercent > 10) reasons.push("cel " + (stats.distanceKm - targetKm >= 0 ? "+" : "") + (stats.distanceKm - targetKm).toFixed(1) + " km");
        if ((stats.roadRiskPercent || 0) > 10) reasons.push("drogi " + Math.round(stats.roadRiskPercent) + "%");
        if ((stats.forestKm || 0) > 1) reasons.push("las " + stats.forestKm.toFixed(1) + " km");
        if ((stats.unpavedKm || 0) > 1) reasons.push("grunt " + stats.unpavedKm.toFixed(1) + " km");
        if (stats.maxGrade > (Number(dom.maxGrade.value) || 4)) reasons.push("max " + stats.maxGrade.toFixed(1) + "%");

        dom.qualityBadge.className = className;
        dom.qualityBadge.textContent = "Jakość trasy - " + label + (reasons.length ? " | " + reasons.slice(0, 2).join(", ") : "");
        if (dom.qualityHelp) {
          const gradeLimit = Number(dom.maxGrade.value) || 4;
          const baseTip = distanceTargetActive
            ? "Jakość trasy - " + label + ": pierwsza liczba na pasku to dystans całej trasy. Pozycja cel +/- km oznacza różnicę względem wpisanego dystansu, nie długość trasy. Liczę też ryzyko dróg z OSM, las, grunt/szuter oraz maksymalne nachylenie z profilu wysokości."
            : "Jakość trasy - " + label + ": tryb Własna trasa ma własny dystans, więc nie porównuję go do pola Dystans km. Oceniam faktyczny ślad: drogi, las, grunt/szuter, podjazdy i profil wysokości.";
          const goodTip = "Dobra oznacza: dystans jest blisko celu, jest mało lasu i gruntu, ryzyko dróg jest niskie, a najmocniejsze podjazdy mieszczą się w limicie około " + gradeLimit.toFixed(1) + "%.";
          const badTip = "Co obniża ocenę: " + (reasons.length ? reasons.join(", ") : "brak jednego dużego problemu, ale suma mniejszych ryzyk podniosła ocenę") + ".";
          const fullTip = baseTip + " " + (label === "Dobra" ? goodTip : badTip);
          dom.qualityHelp.setAttribute("data-tip", fullTip);
          dom.qualityHelp.setAttribute("title", fullTip);
        }
      }

      function clearWeatherData() {
        state.weatherItems = [];
        if (typeof weatherHazardLayer !== "undefined") weatherHazardLayer.clearLayers();
        if (typeof weatherDetailLayer !== "undefined") weatherDetailLayer.clearLayers();
        if (dom.weatherSummary) dom.weatherSummary.textContent = "Wyznacz trasę i kliknij Pogoda trasy.";
        if (dom.weatherGrid) dom.weatherGrid.innerHTML = "";
        if (dom.windZonePanel) {
          dom.windZonePanel.classList.add("hidden");
          dom.windZonePanel.innerHTML = "";
        }
        if (dom.weatherWidgetMain) {
          dom.weatherWidgetMain.textContent = "brak danych";
          dom.weatherWidgetSub.textContent = "kliknij Pogoda trasy";
        }
      }

      function clearRouteAnalysisData() {
        state.routeFoodShops = [];
        state.routeAttractions = [];
        state.routeLodgings = [];
        state.routeWarnings = [];
        state.manualCorrections = [];
        state.manualCorrectionId = 0;
        state.pendingCorrection = null;
        state.manualCorrectionMode = false;
        if (dom.correctionPanel) dom.correctionPanel.classList.remove("visible");
        syncManualCorrectionButtons();
        routeFoodShopLayer.clearLayers();
        routeAttractionLayer.clearLayers();
        routeLodgingLayer.clearLayers();
        drawPlannedBreaks();
        if (dom.routeReportSummary) dom.routeReportSummary.innerHTML = "";
        if (dom.routeNearbyList) dom.routeNearbyList.innerHTML = "";
        if (dom.routeReportDetails) dom.routeReportDetails.innerHTML = "";
        if (dom.routeWarningList) dom.routeWarningList.innerHTML = "";
        if (dom.routeStopList) dom.routeStopList.innerHTML = "";
        if (dom.routeReportPanel) dom.routeReportPanel.classList.remove("visible");
      }

      function resizeProfile() {
        const ratio = window.devicePixelRatio || 1;
        const rect = dom.profileCanvas.getBoundingClientRect();
        const cssWidth = rect.width || dom.profileCanvas.parentElement.clientWidth || window.innerWidth;
        const cssHeight = rect.height || 120;
        dom.profileCanvas.width = Math.max(1, Math.floor(cssWidth * ratio));
        dom.profileCanvas.height = Math.max(1, Math.floor(cssHeight * ratio));
        profileCtx.setTransform(ratio, 0, 0, ratio, 0, 0);
      }

      function gradeColor(grade) {
        if (grade > 6) return "#ff1f7a";
        if (grade > 4) return "#ff2fb2";
        if (grade > 2.2) return "#ff7a3d";
        if (grade > 1.25) return "#f6b73c";
        if (grade < -4) return "#12f3d2";
        if (grade < -2) return "#29d9ff";
        if (grade < -1.1) return "#7aeaff";
        return "#4357ff";
      }

      function hexToRgb(hex) {
        const clean = hex.replace("#", "");
        return {
          r: parseInt(clean.slice(0, 2), 16),
          g: parseInt(clean.slice(2, 4), 16),
          b: parseInt(clean.slice(4, 6), 16)
        };
      }

      function mixColor(a, b, ratio) {
        const ca = hexToRgb(a);
        const cb = hexToRgb(b);
        const t = clamp(ratio, 0, 1);
        const r = Math.round(ca.r + (cb.r - ca.r) * t);
        const g = Math.round(ca.g + (cb.g - ca.g) * t);
        const blue = Math.round(ca.b + (cb.b - ca.b) * t);
        return "rgb(" + r + "," + g + "," + blue + ")";
      }

      function slopeShadeColor(grade, progress) {
        const intensity = clamp(Math.abs(grade) / 7, 0, 1);
        const directionGlow = clamp(progress, 0, 1) * 0.18;
        if (grade > 1.2) {
          return mixColor("#ff405a", "#ff2fb2", Math.min(1, intensity + directionGlow));
        }
        if (grade < -1.2) {
          return mixColor("#12f3d2", "#7aeaff", Math.min(1, intensity + directionGlow));
        }
        return mixColor("#7a35ff", "#2f86ff", 0.35 + directionGlow);
      }

      function roadSampleAtProgress(stats, progress) {
        const samples = stats && Array.isArray(stats.roadSamples) ? stats.roadSamples : [];
        if (!samples.length) return null;
        const index = clamp(Math.round(clamp(progress, 0, 1) * (samples.length - 1)), 0, samples.length - 1);
        return samples[index] || null;
      }

      function routeRiskShadeColor(stats, grade, progress, roadSample) {
        if (roadSample) {
          if (roadSample.forbidden || roadSample.national) return mixColor("#ff405a", "#ff2fb2", progress);
          if (roadSample.voivodeship || roadSample.main || roadSample.risk >= 5.5) return mixColor("#ffd166", "#ff9f1c", progress);
          if (roadSample.unpaved) return roadSample.forest ? mixColor("#ff9f1c", "#ff2fb2", 0.35 + progress * 0.4) : mixColor("#ffd166", "#ff9f1c", 0.35 + progress * 0.4);
          if (roadSample.forest) return mixColor("#0c7e5f", "#12f3d2", progress);
          if (roadSample.bike) return mixColor("#12f3d2", "#7aeaff", progress);
          if (roadSample.local) return mixColor("#7aeaff", "#2f86ff", progress);
          if (roadSample.unknownRoad || roadSample.unknownSurface) return mixColor("#7a35ff", "#ffd166", progress);
        }
        const roadRisk = stats ? Number(stats.roadRiskPercent || 0) : 0;
        const unpavedRatio = stats && stats.distanceKm ? clamp((stats.unpavedKm || 0) / stats.distanceKm, 0, 1) : 0;
        const forestRatio = stats && stats.distanceKm ? clamp((stats.forestKm || 0) / stats.distanceKm, 0, 1) : 0;
        const risk = clamp(roadRisk / 35 + unpavedRatio * 1.8 + forestRatio * 0.9 + Math.max(0, Math.abs(grade) - 6) / 8, 0, 1);
        if (risk > 0.72) return mixColor("#ff405a", "#ff2fb2", progress);
        if (risk > 0.38) return mixColor("#ffd166", "#ff9f1c", progress);
        if (forestRatio > 0.08) return mixColor("#0c7e5f", "#12f3d2", progress);
        return mixColor("#7aeaff", "#2f86ff", progress);
      }


      function manualCorrectionColor(type) {
        if (type === "climb") return "#ff2fb2";
        if (type === "descent") return "#12f3d2";
        if (type === "badroad") return "#ffb21c";
        if (type === "ok") return "#7aeaff";
        return "#ff2fb2";
      }

      function manualCorrectionLabel(type) {
        if (type === "climb") return "Mocny podjazd";
        if (type === "descent") return "Stromy zjazd";
        if (type === "badroad") return "Gorsza droga";
        if (type === "ok") return "Odcinek OK";
        return "Korekta";
      }

      function manualCorrectionShortLabel(type) {
        if (type === "climb") return "podjazd";
        if (type === "descent") return "zjazd";
        if (type === "badroad") return "droga";
        if (type === "ok") return "OK";
        return "korekta";
      }

      function syncManualCorrectionButtons() {
        const active = !!state.manualCorrectionMode;
        const label = active ? "Kliknij odcinek" : "Korekta odcinka";
        for (const button of [dom.manualCorrectionBtn, dom.quickCorrectionBtn, dom.fullscreenCorrectionBtn]) {
          if (!button) continue;
          button.classList.toggle("active", active);
          button.textContent = button === dom.manualCorrectionBtn ? label : (active ? "Korekta: ON" : "Korekta");
        }
      }

      function closeManualCorrectionPanel() {
        state.pendingCorrection = null;
        if (dom.correctionPanel) dom.correctionPanel.classList.remove("visible");
        syncManualCorrectionButtons();
      }

      function setManualCorrectionMode(active) {
        state.manualCorrectionMode = !!active;
        if (state.manualCorrectionMode) {
          state.addingPoint = false;
          state.drawingArea = false;
          state.areaMouseDown = false;
          dom.addPointBtn.classList.remove("amber");
          dom.drawAreaBtn.classList.remove("violet");
          setStatus("Korekta włączona: kliknij linię trasy i oznacz odcinek ręcznie.", "warn");
        } else {
          closeManualCorrectionPanel();
          setStatus("Korekta odcinka wyłączona.");
        }
        syncManualCorrectionButtons();
      }

      function toggleManualCorrectionMode() {
        setManualCorrectionMode(!state.manualCorrectionMode);
      }

      function syncCorrectionRangeLabel() {
        if (!dom.correctionRange || !dom.correctionRangeOut) return;
        dom.correctionRangeOut.textContent = (Number(dom.correctionRange.value) || 1).toFixed(1) + " km";
      }

      function routeSegmentLatLngs(fromKm, toKm) {
        const route = state.routeLatLngs || [];
        if (route.length < 2) return [];
        const totalKm = state.stats ? state.stats.distanceKm : routeDistanceKm(route);
        const from = clamp(Math.min(fromKm, toKm), 0, totalKm);
        const to = clamp(Math.max(fromKm, toKm), 0, totalKm);
        const startPoint = routePointAtDistance(route, from);
        const endPoint = routePointAtDistance(route, to);
        if (!startPoint || !endPoint) return [];
        const distances = state.routeDistances && state.routeDistances.length === route.length ? state.routeDistances : routeSampleDistances(route);
        const points = [startPoint.point];
        for (let i = 1; i < route.length - 1; i += 1) {
          const km = distances[i] || 0;
          if (km > from && km < to) points.push(route[i]);
        }
        points.push(endPoint.point);
        return points;
      }

      function manualCorrectionForKm(km) {
        return (state.manualCorrections || []).find((item) => km >= item.fromKm && km <= item.toKm) || null;
      }

      function drawManualCorrections() {
        manualCorrectionLayer.clearLayers();
        const corrections = state.manualCorrections || [];
        for (const item of corrections) {
          const points = routeSegmentLatLngs(item.fromKm, item.toKm);
          if (points.length < 2) continue;
          const color = manualCorrectionColor(item.type);
          L.polyline(points, {
            color,
            weight: 12,
            opacity: 0.9,
            lineCap: "round",
            lineJoin: "round",
            dashArray: item.type === "ok" ? "2 10" : null,
            interactive: false
          }).addTo(manualCorrectionLayer);
          const mid = routePointAtDistance(state.routeLatLngs, (item.fromKm + item.toKm) / 2);
          if (!mid || !mid.point) continue;
          const icon = L.divIcon({
            className: "",
            html: '<div class="manual-correction-badge">' + escapeHtml(manualCorrectionShortLabel(item.type)) + '</div>',
            iconSize: [64, 22],
            iconAnchor: [32, 36]
          });
          L.marker(mid.point, { icon, interactive: false, keyboard: false }).addTo(manualCorrectionLayer);
        }
      }

      function openManualCorrectionAt(latlng) {
        if (!state.routeLatLngs.length) {
          setStatus("Najpierw wyznacz albo wczytaj trasę, potem kliknij odcinek do korekty.", "warn");
          return;
        }
        const projection = closestRouteProjection(latlng, 42);
        if (!projection) {
          setStatus("Kliknij bliżej linii trasy, żeby ustawić korektę odcinka.", "warn");
          return;
        }
        syncCorrectionRangeLabel();
        const rangeKm = Number(dom.correctionRange && dom.correctionRange.value) || 1;
        const totalKm = state.stats ? state.stats.distanceKm : routeDistanceKm(state.routeLatLngs);
        state.pendingCorrection = {
          centerKm: projection.distanceAlongKm,
          fromKm: clamp(projection.distanceAlongKm - rangeKm / 2, 0, totalKm),
          toKm: clamp(projection.distanceAlongKm + rangeKm / 2, 0, totalKm),
          point: projection.point
        };
        if (dom.correctionTitle) dom.correctionTitle.textContent = "Korekta: km " + projection.distanceAlongKm.toFixed(1);
        if (dom.correctionHint) dom.correctionHint.textContent = "Odcinek ok. km " + state.pendingCorrection.fromKm.toFixed(1) + "-" + state.pendingCorrection.toKm.toFixed(1) + ". Wybierz typ i zapisz.";
        if (dom.correctionPanel) dom.correctionPanel.classList.add("visible");
        setProfileHover(projection.profileIndex, projection.distanceAlongKm, projection.point);
      }

      function refreshPendingCorrectionRange() {
        syncCorrectionRangeLabel();
        if (!state.pendingCorrection || !state.routeLatLngs.length) return;
        const rangeKm = Number(dom.correctionRange && dom.correctionRange.value) || 1;
        const totalKm = state.stats ? state.stats.distanceKm : routeDistanceKm(state.routeLatLngs);
        state.pendingCorrection.fromKm = clamp(state.pendingCorrection.centerKm - rangeKm / 2, 0, totalKm);
        state.pendingCorrection.toKm = clamp(state.pendingCorrection.centerKm + rangeKm / 2, 0, totalKm);
        if (dom.correctionHint) dom.correctionHint.textContent = "Odcinek ok. km " + state.pendingCorrection.fromKm.toFixed(1) + "-" + state.pendingCorrection.toKm.toFixed(1) + ". Wybierz typ i zapisz.";
      }

      function applyManualCorrection() {
        if (!state.pendingCorrection) {
          setStatus("Najpierw kliknij linię trasy w trybie Korekta.", "warn");
          return;
        }
        refreshPendingCorrectionRange();
        const type = dom.correctionType ? dom.correctionType.value : "climb";
        const item = {
          id: ++state.manualCorrectionId,
          type,
          fromKm: state.pendingCorrection.fromKm,
          toKm: state.pendingCorrection.toKm,
          centerKm: state.pendingCorrection.centerKm
        };
        state.manualCorrections = (state.manualCorrections || []).filter((correction) => correction.toKm < item.fromKm || correction.fromKm > item.toKm);
        state.manualCorrections.push(item);
        state.manualCorrections.sort((a, b) => a.fromKm - b.fromKm);
        drawRouteShading(state.routeLatLngs, state.stats);
        drawManualCorrections();
        renderRouteReport("Kontrola trasy");
        setStatus("Zapisano ręczną korektę: " + manualCorrectionLabel(type) + " na km " + item.fromKm.toFixed(1) + "-" + item.toKm.toFixed(1) + ".");
      }

      function removeNearestManualCorrection() {
        const center = state.pendingCorrection ? state.pendingCorrection.centerKm : null;
        if (!state.manualCorrections || !state.manualCorrections.length) {
          setStatus("Nie ma ręcznych korekt do usunięcia.", "warn");
          return;
        }
        let bestIndex = 0;
        let bestDistance = Infinity;
        state.manualCorrections.forEach((item, index) => {
          const itemCenter = (item.fromKm + item.toKm) / 2;
          const distance = center == null ? index : Math.abs(itemCenter - center);
          if (distance < bestDistance) {
            bestDistance = distance;
            bestIndex = index;
          }
        });
        const removed = state.manualCorrections.splice(bestIndex, 1)[0];
        drawRouteShading(state.routeLatLngs, state.stats);
        drawManualCorrections();
        renderRouteReport("Kontrola trasy");
        setStatus("Usunięto korektę: " + manualCorrectionLabel(removed.type) + " km " + removed.fromKm.toFixed(1) + "-" + removed.toKm.toFixed(1) + ".");
      }

      function jumpToRouteKmRange(fromKm, toKm) {
        if (!state.routeLatLngs.length) return;
        const points = routeSegmentLatLngs(fromKm, toKm);
        if (points.length >= 2) map.fitBounds(L.latLngBounds(points).pad(0.28));
        const mid = routePointAtDistance(state.routeLatLngs, (fromKm + toKm) / 2);
        if (mid && mid.point) {
          const projection = closestRouteProjection(mid.point, 80);
          if (projection) setProfileHover(projection.profileIndex, projection.distanceAlongKm, projection.point);
        }
      }

      function hotspotHtml(items, emptyText) {
        if (!items.length) return '<div class="report-item">' + escapeHtml(emptyText) + '</div>';
        return '<ul class="route-hotspot-list">' + items.map((item) => '<li class="route-hotspot ' + escapeHtml(item.type || '') + '"><span><strong>' + escapeHtml(item.title) + '</strong>' + escapeHtml(item.text) + '</span><button type="button" data-jump-from="' + item.fromKm.toFixed(3) + '" data-jump-to="' + item.toKm.toFixed(3) + '">Pokaż</button></li>').join("") + '</ul>';
      }

      function buildRouteHotspotItems(analysis) {
        const items = [];
        (analysis.climbs || []).slice().sort((a, b) => b.score - a.score).slice(0, 6).forEach((segment) => {
          items.push({ type: "climb", fromKm: segment.fromKm, toKm: segment.toKm, title: "Podjazd " + kmRangeText(segment), text: "+" + Math.round(segment.gainM) + " m, max " + segment.maxGrade.toFixed(1) + "%" });
        });
        (analysis.descents || []).slice().sort((a, b) => b.score - a.score).slice(0, 4).forEach((segment) => {
          items.push({ type: "descent", fromKm: segment.fromKm, toKm: segment.toKm, title: "Zjazd " + kmRangeText(segment), text: "-" + Math.round(segment.dropM) + " m, max " + segment.maxGrade.toFixed(1) + "%" });
        });
        if (analysis.worstRoad) {
          items.push({ type: "badroad", fromKm: analysis.worstRoad.fromKm, toKm: analysis.worstRoad.toKm, title: "Najgorsza droga " + kmRangeText(analysis.worstRoad), text: analysis.worstRoad.reasonText || "ryzyko drogi" });
        }
        return items.sort((a, b) => a.fromKm - b.fromKm).slice(0, 10);
      }

      function buildManualCorrectionItems() {
        return (state.manualCorrections || []).map((item) => ({
          type: item.type,
          fromKm: item.fromKm,
          toKm: item.toKm,
          title: manualCorrectionLabel(item.type) + " km " + item.fromKm.toFixed(1) + "-" + item.toKm.toFixed(1),
          text: "ręcznie ustawione przez użytkownika"
        }));
      }
      function syncRouteColorButtons() {
        const roadMode = state.routeColorMode === "risk";
        const label = roadMode ? "Kolor: drogi" : "Kolor: podjazdy";
        if (dom.routeColorBtn) dom.routeColorBtn.textContent = label;
        if (dom.fullscreenColorBtn) dom.fullscreenColorBtn.textContent = roadMode ? "Drogi" : "Podjazdy";
      }

      function toggleRouteColorMode() {
        state.routeColorMode = state.routeColorMode === "risk" ? "slope" : "risk";
        syncRouteColorButtons();
        drawRouteShading(state.routeLatLngs, state.stats);
        if (state.routeColorMode === "risk" && (!state.stats || !state.stats.roadSamples || !state.stats.roadSamples.length)) {
          setStatus("Kolor dróg wymaga analizy OSM. Dla tej trasy nie ma jeszcze szczegółowych danych odcinków.", "warn");
        } else {
          setStatus(state.routeColorMode === "risk" ? "Kolor dróg: błękit lokalne/rowerowe, zieleń las, złoto szuter/ryzyko, róż DK/DW/główne." : "Kolor trasy pokazuje podjazdy i zjazdy według profilu.");
        }
      }

      function bearingDeg(a, b) {
        const lat1 = toRad(a.lat);
        const lat2 = toRad(b.lat);
        const dLng = toRad(b.lng - a.lng);
        const y = Math.sin(dLng) * Math.cos(lat2);
        const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
        return (toDeg(Math.atan2(y, x)) + 360) % 360;
      }

      function routeVisualSamples(routeLatLngs) {
        const maxVisualPoints = 900;
        return routeLatLngs.length > maxVisualPoints ? sampleRoute(routeLatLngs, maxVisualPoints) : routeLatLngs.slice();
      }

      function elevationAtProgress(elevations, progress) {
        if (!elevations || elevations.length < 2) return null;
        const pos = clamp(progress, 0, 1) * (elevations.length - 1);
        const left = Math.floor(pos);
        const right = Math.min(elevations.length - 1, left + 1);
        const ratio = pos - left;
        return elevations[left] + (elevations[right] - elevations[left]) * ratio;
      }

      function routeSampleDistances(samples) {
        const distances = [0];
        for (let i = 1; i < samples.length; i += 1) {
          distances.push(distances[i - 1] + haversineKm(samples[i - 1], samples[i]));
        }
        return distances;
      }

      function medianValue(values) {
        const clean = values.filter((value) => Number.isFinite(value)).sort((a, b) => a - b);
        if (!clean.length) return null;
        const mid = Math.floor(clean.length / 2);
        return clean.length % 2 ? clean[mid] : (clean[mid - 1] + clean[mid]) / 2;
      }

      function elevationNoiseThreshold(distKm) {
        if (distKm < 0.04) return 1.4;
        if (distKm < 0.12) return 0.9;
        return 0.45;
      }

      function gradeWindowForDistance(totalKm) {
        if (totalKm < 8) return 0.24;
        if (totalKm < 35) return 0.36;
        if (totalKm < 90) return 0.52;
        return 0.68;
      }

      function smoothedElevationSeries(elevations, distances, windowKm) {
        if (!Array.isArray(elevations) || elevations.length < 2) return Array.isArray(elevations) ? elevations.slice() : [];
        const safeDistances = Array.isArray(distances) && distances.length === elevations.length
          ? distances
          : elevations.map((_, index) => index / Math.max(1, elevations.length - 1));
        const totalKm = safeDistances[safeDistances.length - 1] || 0;
        const halfWindow = Math.max(0.08, windowKm || Math.min(0.42, Math.max(0.16, totalKm / 180)));
        return elevations.map((value, index) => {
          const centerKm = safeDistances[index] || 0;
          const local = [];
          let weighted = 0;
          let weightSum = 0;
          for (let j = 0; j < elevations.length; j += 1) {
            const distance = Math.abs((safeDistances[j] || 0) - centerKm);
            if (distance > halfWindow) continue;
            const elevation = Number(elevations[j]);
            if (!Number.isFinite(elevation)) continue;
            const weight = 1 / (1 + distance / Math.max(0.03, halfWindow));
            weighted += elevation * weight;
            weightSum += weight;
            local.push(elevation);
          }
          const median = medianValue(local);
          if (median == null || !weightSum) return Number.isFinite(Number(value)) ? Number(value) : 0;
          const average = weighted / weightSum;
          return median * 0.56 + average * 0.44;
        });
      }

      function stableGradeFromArrays(elevations, distances, index, windowKm) {
        if (!Array.isArray(elevations) || elevations.length < 2 || !Array.isArray(distances) || distances.length !== elevations.length) return 0;
        const safeIndex = clamp(index, 0, elevations.length - 1);
        const totalKm = distances[distances.length - 1] || 0;
        const halfWindow = Math.max(0.12, windowKm || gradeWindowForDistance(totalKm));
        const centerKm = distances[safeIndex] || 0;
        let left = safeIndex;
        let right = safeIndex;
        while (left > 0 && centerKm - (distances[left] || 0) < halfWindow) left -= 1;
        while (right < elevations.length - 1 && (distances[right] || 0) - centerKm < halfWindow) right += 1;
        if (right === left) {
          left = Math.max(0, safeIndex - 1);
          right = Math.min(elevations.length - 1, safeIndex + 1);
        }
        const segmentKm = Math.max(0.03, (distances[right] || 0) - (distances[left] || 0));
        const dz = elevations[right] - elevations[left];
        return dz / (segmentKm * 1000) * 100;
      }

      function smoothedRouteGrade(samples, distances, elevations, index, windowKm) {
        if (!elevations || elevations.length < 2 || !samples.length || !distances.length) return 0;
        const safeIndex = clamp(index, 0, samples.length - 1);
        const centerKm = distances[safeIndex] || 0;
        const halfWindow = Math.max(0.18, windowKm || 0.45);
        let left = safeIndex;
        let right = safeIndex;
        while (left > 0 && centerKm - distances[left] < halfWindow) left -= 1;
        while (right < distances.length - 1 && distances[right] - centerKm < halfWindow) right += 1;
        if (right === left) {
          left = Math.max(0, safeIndex - 1);
          right = Math.min(samples.length - 1, safeIndex + 1);
        }
        const totalKm = distances[distances.length - 1] || routeDistanceKm(samples);
        const segmentKm = Math.max(0.05, (distances[right] || 0) - (distances[left] || 0));
        const leftProgress = totalKm > 0 ? (distances[left] || 0) / totalKm : left / Math.max(1, samples.length - 1);
        const rightProgress = totalKm > 0 ? (distances[right] || 0) / totalKm : right / Math.max(1, samples.length - 1);
        const leftElevation = elevationAtProgress(elevations, leftProgress);
        const rightElevation = elevationAtProgress(elevations, rightProgress);
        if (leftElevation == null || rightElevation == null) return 0;
        return (rightElevation - leftElevation) / (segmentKm * 1000) * 100;
      }

      function drawRouteShading(routeLatLngs, stats) {
        routeShadeLayer.clearLayers();
        routeDirectionLayer.clearLayers();
        if (!routeLatLngs || routeLatLngs.length < 2) return;
        const baseElevations = stats && stats.elevations && stats.elevations.length >= 2 ? stats.elevations : [];
        const samples = routeVisualSamples(routeLatLngs);
        if (samples.length < 2) return;
        const distances = routeSampleDistances(samples);
        const totalKm = distances[distances.length - 1] || 0;
        const gradeWindow = gradeWindowForDistance(totalKm);
        const elevationDistances = baseElevations.length
          ? baseElevations.map((_, index) => totalKm * index / Math.max(1, baseElevations.length - 1))
          : [];
        const elevations = stats && stats.smoothElevations && stats.smoothElevations.length >= 2
          ? stats.smoothElevations
          : (baseElevations.length ? smoothedElevationSeries(baseElevations, elevationDistances) : []);

        for (let i = 1; i < samples.length; i += 1) {
          const progress = totalKm > 0 ? (distances[i] || 0) / totalKm : i / (samples.length - 1);
          const grade = smoothedRouteGrade(samples, distances, elevations, i, gradeWindow);
          const roadSample = roadSampleAtProgress(stats, progress);
          const kmAtSegment = distances[i] || 0;
          const correction = manualCorrectionForKm(kmAtSegment);
          L.polyline([samples[i - 1], samples[i]], {
            color: correction ? manualCorrectionColor(correction.type) : (state.routeColorMode === "risk" ? routeRiskShadeColor(stats, grade, progress, roadSample) : slopeShadeColor(grade, progress)),
            weight: correction ? 10 : (state.routeColorMode === "risk" ? 8 : 7),
            opacity: elevations.length >= 2 ? 0.96 : 0.7,
            lineCap: "round",
            lineJoin: "round",
            interactive: false
          }).addTo(routeShadeLayer);
        }

        const arrowCount = Math.min(9, Math.max(3, Math.floor(samples.length / 18)));
        for (let i = 1; i <= arrowCount; i += 1) {
          const index = clamp(Math.round(i * (samples.length - 1) / (arrowCount + 1)), 1, samples.length - 1);
          const angle = bearingDeg(samples[index - 1], samples[index]);
          const icon = L.divIcon({
            className: "",
            html: '<div class="route-arrow" style="transform: rotate(' + angle.toFixed(1) + 'deg)"></div>',
            iconSize: [14, 14],
            iconAnchor: [7, 7]
          });
          L.marker(samples[index], { icon, interactive: false }).addTo(routeDirectionLayer);
        }
      }

      function profileGradeAt(index) {
        const elevations = state.profileSmoothElevations && state.profileSmoothElevations.length === state.profileElevations.length
          ? state.profileSmoothElevations
          : state.profileElevations;
        if (!elevations.length || elevations.length < 2 || !state.profileDistances.length) return 0;
        return stableGradeFromArrays(elevations, state.profileDistances, index, gradeWindowForDistance(state.profileDistances[state.profileDistances.length - 1] || 0));
      }

      function smoothedProfileGradeAt(index, windowKm) {
        const elevations = state.profileSmoothElevations && state.profileSmoothElevations.length === state.profileElevations.length
          ? state.profileSmoothElevations
          : state.profileElevations;
        return stableGradeFromArrays(elevations, state.profileDistances, index, windowKm);
      }

      function fatigueSegmentCandidates() {
        const candidates = [];
        if (!state.profileElevations.length || !state.profileDistances.length) return candidates;
        const smoothElevations = state.profileSmoothElevations && state.profileSmoothElevations.length === state.profileElevations.length
          ? state.profileSmoothElevations
          : smoothedElevationSeries(state.profileElevations, state.profileDistances);
        const totalKm = state.profileDistances[state.profileDistances.length - 1] || 0;
        let start = -1;
        let ascent = 0;
        let maxGrade = 0;

        function pushSegment(endIndex) {
          if (start < 0 || endIndex <= start) return;
          const startKm = state.profileDistances[start] || 0;
          const endKm = state.profileDistances[endIndex] || startKm;
          const distanceKm = Math.max(0.01, endKm - startKm);
          const avgGrade = ascent / Math.max(1, distanceKm * 1000) * 100;
          const midIndex = clamp(Math.round((start + endIndex) / 2), 0, state.profileLatLngs.length - 1);
          const lateBonus = endKm > totalKm * 0.5 ? 1.2 : 1;
          const veryLateBonus = endKm > totalKm * 0.72 ? 1.35 : 1;
          const score = (avgGrade * 1.7 + maxGrade * 0.75 + ascent / 5.5 + distanceKm * 0.8) * lateBonus * veryLateBonus;
          if (distanceKm >= 0.28 && ascent >= 8 && (avgGrade >= 1.2 || maxGrade >= 3.2)) {
            candidates.push({
              index: midIndex,
              point: state.profileLatLngs[midIndex],
              distanceKm: state.profileDistances[midIndex] || endKm,
              grade: Math.max(avgGrade, maxGrade),
              ascent,
              score,
              kind: endKm > totalKm * 0.62 ? "late" : "climb"
            });
          }
        }

        for (let i = 1; i < state.profileElevations.length; i += 1) {
          const segmentKm = Math.max(0.001, (state.profileDistances[i] || 0) - (state.profileDistances[i - 1] || 0));
          const dz = smoothElevations[i] - smoothElevations[i - 1];
          const grade = smoothedProfileGradeAt(i, 0.42);
          if (grade > 0.75) {
            if (start < 0) {
              start = i - 1;
              ascent = 0;
              maxGrade = 0;
            }
            ascent += Math.max(0, dz);
            maxGrade = Math.max(maxGrade, grade);
          } else if (start >= 0 && grade > -0.5 && segmentKm < 0.45) {
            ascent += Math.max(0, dz);
          } else if (start >= 0) {
            pushSegment(i - 1);
            start = -1;
            ascent = 0;
            maxGrade = 0;
          }
        }
        if (start >= 0) pushSegment(state.profileElevations.length - 1);

        const rollingKm = 4.5;
        for (let i = 0; i < state.profileElevations.length - 2; i += 2) {
          const startKm = state.profileDistances[i] || 0;
          let end = i + 1;
          let rollingAscent = 0;
          let rollingMax = 0;
          while (end < state.profileElevations.length && (state.profileDistances[end] || 0) - startKm <= rollingKm) {
            const segKm = Math.max(0.001, (state.profileDistances[end] || 0) - (state.profileDistances[end - 1] || 0));
            const dz = smoothElevations[end] - smoothElevations[end - 1];
            if (dz > elevationNoiseThreshold(segKm)) rollingAscent += dz;
            rollingMax = Math.max(rollingMax, smoothedProfileGradeAt(end, 0.52));
            end += 1;
          }
          const endKm = state.profileDistances[Math.min(end, state.profileElevations.length - 1)] || startKm;
          const midIndex = clamp(Math.round((i + end) / 2), 0, state.profileLatLngs.length - 1);
          const lateBonus = endKm > totalKm * 0.5 ? 1.25 : 1;
          const score = (rollingAscent / 7 + Math.max(0, rollingMax) * 0.55) * lateBonus;
          if (rollingAscent >= 28 && score >= 5.5) {
            candidates.push({
              index: midIndex,
              point: state.profileLatLngs[midIndex],
              distanceKm: state.profileDistances[midIndex] || startKm,
              grade: rollingMax,
              ascent: rollingAscent,
              score,
              kind: "series"
            });
          }
        }
        return candidates;
      }

      function drawClimbBadges() {
        climbBadgeLayer.clearLayers();
        if (!state.profileLatLngs.length || state.profileElevations.length < 2 || !state.profileDistances.length) return;
        const targetGrade = desiredGradeTarget();
        const preferredThreshold = targetGrade > 0 ? Math.max(2.4, targetGrade * 0.55) : 2.6;
        const analysis = profileSegmentAnalysis(state.stats || {});
        const climbs = (analysis.climbs || []).filter((segment) => (segment.maxGrade || 0) >= preferredThreshold || (segment.gainM || 0) >= 18 || segment.level === "bad");
        climbs.sort((a, b) => (b.score || 0) - (a.score || 0));
        const selected = [];
        const minKmGap = Math.max(1.2, (state.profileDistances[state.profileDistances.length - 1] || 0) / 20);
        for (const segment of climbs) {
          const midKm = ((segment.fromKm || 0) + (segment.toKm || segment.fromKm || 0)) / 2;
          if (selected.some((item) => Math.abs(item.midKm - midKm) < minKmGap)) continue;
          let index = 0;
          let bestDelta = Infinity;
          for (let i = 0; i < state.profileDistances.length; i += 1) {
            const delta = Math.abs((state.profileDistances[i] || 0) - midKm);
            if (delta < bestDelta) {
              bestDelta = delta;
              index = i;
            }
          }
          selected.push({ ...segment, midKm, index, point: state.profileLatLngs[index] });
          if (selected.length >= 8) break;
        }
        selected.sort((a, b) => a.index - b.index);
        for (const badge of selected) {
          const gradeText = badge.maxGrade < 10 ? badge.maxGrade.toFixed(1) : Math.round(badge.maxGrade);
          const title = badge.difficulty ? badge.difficulty.replace("ciężki ", "").replace("męczący ", "") : "podjazd";
          const icon = L.divIcon({
            className: "",
            html: '<div class="route-climb-badge" title="' + escapeHtml(title + ': ' + kmRangeText(badge)) + '">↗ ' + gradeText + '%</div>',
            iconSize: [54, 28],
            iconAnchor: [27, 48]
          });
          L.marker(badge.point, {
            icon,
            pane: "climbPane",
            interactive: false,
            keyboard: false
          }).addTo(climbBadgeLayer);
        }
      }
      function fatigueLabel(score, grade, distanceKm, kind) {
        if (kind === "series") return "🔥 seria";
        if (kind === "late" && score >= 5.4) return "⚠ końcówka";
        if (score >= 8) return "🔥 ciężko";
        if (score >= 6) return distanceKm > 45 ? "⚠ końcówka" : "⚠ podjazd";
        if (grade >= 4) return "⚠ ostro";
        return "⚠";
      }

      function drawFatigueBadges() {
        fatigueBadgeLayer.clearLayers();
        if (!state.profileLatLngs.length || state.profileElevations.length < 2 || !state.profileDistances.length) return [];
        const totalKm = state.profileDistances[state.profileDistances.length - 1] || routeDistanceKm(state.profileLatLngs);
        const candidates = fatigueSegmentCandidates();
        for (let i = 1; i < state.profileElevations.length - 1; i += 1) {
          const gradeShort = smoothedProfileGradeAt(i, 0.35);
          const gradeLong = smoothedProfileGradeAt(i, 1.1);
          const distanceKm = state.profileDistances[i] || 0;
          const lateFactor = distanceKm > totalKm * 0.48 ? 1.15 : 1;
          const veryLateFactor = distanceKm > totalKm * 0.68 ? 1.25 : 1;
          const score = Math.max(0, gradeShort) * 1.25 + Math.max(0, gradeLong) * 2.1 + Math.max(0, (distanceKm - 45) / 18) * 1.3;
          const weightedScore = score * lateFactor * veryLateFactor;
          if (weightedScore >= 3.8 && (gradeShort > 1.9 || gradeLong > 1.25)) {
            candidates.push({
              index: i,
              point: state.profileLatLngs[i],
              distanceKm,
              grade: Math.max(gradeShort, gradeLong),
              score: weightedScore,
              kind: "point"
            });
          }
        }
        candidates.sort((a, b) => b.score - a.score);
        const selected = [];
        const minIndexGap = Math.max(10, Math.floor(state.profileElevations.length / 9));
        for (const candidate of candidates) {
          if (selected.some((item) => Math.abs(item.index - candidate.index) < minIndexGap)) continue;
          selected.push(candidate);
          if (selected.length >= 6) break;
        }
        selected.sort((a, b) => a.index - b.index);
        for (const item of selected) {
          const label = fatigueLabel(item.score, item.grade, item.distanceKm, item.kind);
          const icon = L.divIcon({
            className: "",
            html: '<div class="fatigue-badge">' + label + "</div>",
            iconSize: [78, 26],
            iconAnchor: [39, 46]
          });
          L.marker(item.point, {
            icon,
            pane: "fatiguePane",
            interactive: false,
            keyboard: false
          }).addTo(fatigueBadgeLayer);
        }
        return selected;
      }

      function gradeLabel(grade) {
        if (grade > 0.8) return "podjazd";
        if (grade < -0.8) return "zjazd";
        return "płasko";
      }

      function setProfileHover(index, exactDistanceKm, exactPoint) {
        if (!state.profileLatLngs.length) return;
        const nextIndex = clamp(index, 0, state.profileLatLngs.length - 1);
        state.profileHoverIndex = nextIndex;
        if ((state.profileZoom || 1) > 1.01 && state.profileElevations.length > 1) {
          const visible = profileZoomRange(state.profileElevations.length);
          if (nextIndex < visible.start || nextIndex > visible.end) {
            state.profileZoomCenter = nextIndex / Math.max(1, state.profileElevations.length - 1);
            updateProfileZoomLabel();
          }
        }
        const point = exactPoint || state.profileLatLngs[nextIndex];
        routeHoverMarker.setLatLng(point);
        routeHoverMarker.setStyle({ opacity: 1, fillOpacity: 0.82 });
        const distance = Number.isFinite(exactDistanceKm) ? exactDistanceKm : (state.profileDistances[nextIndex] || 0);
        const elevationValue = Number.isFinite(exactDistanceKm)
          ? profileValueAtDistance(state.profileElevations, exactDistanceKm)
          : state.profileElevations[nextIndex];
        const elevation = Number.isFinite(elevationValue) ? elevationValue : null;
        const grade = profileGradeAt(nextIndex);
        const elevationText = elevation == null ? "-- m" : Math.round(elevation) + " m";
        const laps = getLapCount();
        const trainingText = laps > 1 && state.stats ? "<br>trening razem: " + routeTrainingKm(state.stats).toFixed(1) + " km" : "";
        dom.profileInfo.textContent = distance.toFixed(2) + " km | " + elevationText + " | " + grade.toFixed(1) + "%";
        routeHoverMarker.setStyle({ fillColor: slopeShadeColor(grade, nextIndex / Math.max(1, state.profileLatLngs.length - 1)) });
        routeHoverMarker.setTooltipContent(
          "dystans na pętli: " + distance.toFixed(2) + " km<br>" +
          "nachylenie średnie: " + grade.toFixed(1) + "% (" + gradeLabel(grade) + ")<br>" +
          "wysokość: " + elevationText + trainingText
        );
        routeHoverMarker.openTooltip();
        drawProfile(state.profileElevations);
      }

      function clearProfileHover() {
        if (state.autoPlayActive || state.autoPlayPaused) return;
        state.profileHoverIndex = -1;
        routeHoverMarker.setStyle({ opacity: 0, fillOpacity: 0 });
        routeHoverMarker.closeTooltip();
        updateMetrics(state.stats, "OSRM");
        drawProfile(state.profileElevations);
      }
      function autoPlayTotalKm() {
        return (state.stats && state.stats.distanceKm) || routeDistanceKm(state.routeLatLngs) || (state.profileDistances[state.profileDistances.length - 1] || 0);
      }

      function ascentToDistanceKm(distanceKm) {
        if (!state.profileElevations.length || !state.profileDistances.length) return 0;
        const elevations = state.profileSmoothElevations && state.profileSmoothElevations.length === state.profileElevations.length
          ? state.profileSmoothElevations
          : state.profileElevations;
        const limit = clamp(Number(distanceKm) || 0, 0, state.profileDistances[state.profileDistances.length - 1] || 0);
        let ascent = 0;
        for (let i = 1; i < elevations.length; i += 1) {
          const fromKm = state.profileDistances[i - 1] || 0;
          const toKm = state.profileDistances[i] || fromKm;
          if (fromKm >= limit) break;
          const fromElev = elevations[i - 1];
          const toElev = elevations[i];
          if (!Number.isFinite(fromElev) || !Number.isFinite(toElev) || toKm <= fromKm) continue;
          const ratio = clamp((Math.min(limit, toKm) - fromKm) / Math.max(0.0001, toKm - fromKm), 0, 1);
          const currentElev = fromElev + (toElev - fromElev) * ratio;
          const dz = currentElev - fromElev;
          if (dz > 0) ascent += dz;
          if (toKm >= limit) break;
        }
        return Math.max(0, ascent);
      }

      function autoPlayCalories(distanceKm) {
        const laps = getLapCount();
        const totalKm = autoPlayTotalKm();
        const loopDistance = clamp(distanceKm, 0, totalKm || 0);
        const trainingDistance = loopDistance;
        const ascent = ascentToDistanceKm(loopDistance);
        return estimateCalories(trainingDistance, ascent, state.stats);
      }

      function autoPlayTooltipHtml(distanceKm, index, point) {
        const totalKm = autoPlayTotalKm();
        const done = clamp(distanceKm, 0, totalKm || 0);
        const left = Math.max(0, totalKm - done);
        const elevationValue = profileValueAtDistance(state.profileElevations, done);
        const elevationText = Number.isFinite(elevationValue) ? Math.round(elevationValue) + " m" : "-- m";
        const grade = profileGradeAt(index);
        const kcal = autoPlayCalories(done);
        const totalKcal = calorieEstimate(state.stats);
        const rideTime = formatRideTime(done);
        const totalTime = formatRideTime(totalKm);
        const laps = getLapCount();
        const lapNote = laps > 1 ? "<br>pętla 1/" + laps + " | trening razem: " + (totalKm * laps).toFixed(1) + " km" : "";
        return '<strong>Auto Play - rower na trasie</strong><br>' +
          'przejechane: ' + done.toFixed(1) + ' / ' + totalKm.toFixed(1) + ' km<br>' +
          'zostało: ' + left.toFixed(1) + ' km<br>' +
          'czas: ' + rideTime + ' / ' + totalTime + '<br>' +
          'kcal: ' + kcal + ' / ' + totalKcal + '<br>' +
          'wysokość: ' + elevationText + ' | nachylenie: ' + grade.toFixed(1) + '%' + lapNote;
      }

      function syncAutoPlayButtons() {
        if (!dom.profileAutoPlayBtn || !dom.profileAutoStopBtn) return;
        dom.profileAutoPlayBtn.textContent = state.autoPlayActive && !state.autoPlayPaused ? "❚❚ Pauza" : (state.autoPlayPaused ? "▶ Wznów" : "▶ Auto");
        dom.profileAutoPlayBtn.classList.toggle("active", state.autoPlayActive && !state.autoPlayPaused);
        dom.profileAutoStopBtn.classList.toggle("visible", state.autoPlayActive || state.autoPlayPaused);
      }

      function stopAutoPlay(silent) {
        if (state.autoPlayRafId) cancelAnimationFrame(state.autoPlayRafId);
        state.autoPlayRafId = 0;
        state.autoPlayActive = false;
        state.autoPlayPaused = false;
        state.autoPlayDistanceKm = 0;
        autoPlayMarker.setOpacity(0);
        autoPlayMarker.closeTooltip();
        syncAutoPlayButtons();
        if (!silent) setStatus("Auto Play zatrzymany.");
      }

      function updateAutoPlayFrame(timestamp) {
        if (!state.autoPlayActive || state.autoPlayPaused) return;
        const totalKm = autoPlayTotalKm();
        if (!totalKm || !state.profileLatLngs.length) {
          stopAutoPlay(true);
          setStatus("Najpierw wyznacz trasę i profil, potem użyj Auto Play.", "warn");
          return;
        }
        const elapsedSec = Math.max(0, (timestamp - state.autoPlayStartedAt) / 1000);
        const progress = clamp(elapsedSec / Math.max(1, state.autoPlayDurationSec), 0, 1);
        const distanceKm = totalKm * progress;
        state.autoPlayDistanceKm = distanceKm;
        const located = routePointAtDistance(state.routeLatLngs.length ? state.routeLatLngs : state.profileLatLngs, distanceKm);
        const point = located && located.point ? located.point : state.profileLatLngs[0];
        const index = profileIndexFromDistanceKm(distanceKm);
        autoPlayMarker.setLatLng(point);
        autoPlayMarker.setOpacity(1);
        const markerEl = autoPlayMarker.getElement();
        if (markerEl) markerEl.style.setProperty("--ride-rot", ((located && located.bearing) || 0) + "deg");
        setProfileHover(index, distanceKm, point);
        routeHoverMarker.setStyle({ opacity: 0, fillOpacity: 0 });
        routeHoverMarker.closeTooltip();
        autoPlayMarker.setTooltipContent(autoPlayTooltipHtml(distanceKm, index, point));
        autoPlayMarker.openTooltip();
        dom.profileInfo.textContent = "Auto Play: " + distanceKm.toFixed(1) + " / " + totalKm.toFixed(1) + " km | " + autoPlayCalories(distanceKm) + " kcal";
        if (progress >= 1) {
          stopAutoPlay(true);
          setProfileHover(state.profileLatLngs.length - 1, totalKm, state.profileLatLngs[state.profileLatLngs.length - 1]);
          setStatus("Auto Play dojechał do końca trasy.");
          return;
        }
        state.autoPlayRafId = requestAnimationFrame(updateAutoPlayFrame);
      }

      function startAutoPlay() {
        const totalKm = autoPlayTotalKm();
        if (!totalKm || !state.profileLatLngs.length || state.profileElevations.length < 2) {
          setStatus("Najpierw wyznacz albo wczytaj trasę z profilem wysokości, potem uruchom Auto Play.", "warn");
          return;
        }
        state.autoPlayActive = true;
        state.autoPlayPaused = false;
        state.autoPlayDurationSec = clamp(totalKm * 1.8, 60, 300);
        state.autoPlayStartedAt = performance.now() - (state.autoPlayDistanceKm / Math.max(totalKm, 0.001)) * state.autoPlayDurationSec * 1000;
        syncAutoPlayButtons();
        setStatus("Auto Play uruchomiony: rower jedzie po linii trasy, profil i dymek pokazują postęp.");
        state.autoPlayRafId = requestAnimationFrame(updateAutoPlayFrame);
      }

      function toggleAutoPlay() {
        if (!state.autoPlayActive && !state.autoPlayPaused) {
          state.autoPlayDistanceKm = 0;
          startAutoPlay();
          return;
        }
        if (state.autoPlayPaused) {
          state.autoPlayActive = true;
          state.autoPlayPaused = false;
          const totalKm = autoPlayTotalKm() || 1;
          state.autoPlayStartedAt = performance.now() - (state.autoPlayDistanceKm / totalKm) * Math.max(1, state.autoPlayDurationSec) * 1000;
          syncAutoPlayButtons();
          state.autoPlayRafId = requestAnimationFrame(updateAutoPlayFrame);
          setStatus("Auto Play wznowiony.");
          return;
        }
        state.autoPlayPaused = true;
        state.autoPlayActive = false;
        if (state.autoPlayRafId) cancelAnimationFrame(state.autoPlayRafId);
        state.autoPlayRafId = 0;
        syncAutoPlayButtons();
        setStatus("Auto Play wstrzymany.");
      }

      function hideRouteHoverIfVisible() {
        if (state.profileHoverIndex >= 0) clearProfileHover();
      }

      function nearestRouteIndex(latlng) {
        if (!state.profileLatLngs.length) return -1;
        const projection = closestRouteProjection(latlng);
        return projection ? projection.profileIndex : -1;
      }

      function closestRouteProjection(latlng, maxPixels) {
        const route = state.routeLatLngs && state.routeLatLngs.length >= 2 ? state.routeLatLngs : state.profileLatLngs;
        if (!route || route.length < 2 || !state.profileDistances.length) return null;
        const routeDistances = state.routeDistances && state.routeDistances.length === route.length
          ? state.routeDistances
          : routeSampleDistances(route);
        const target = map.latLngToLayerPoint(latlng);
        let best = null;
        for (let i = 1; i < route.length; i += 1) {
          const a = map.latLngToLayerPoint(route[i - 1]);
          const b = map.latLngToLayerPoint(route[i]);
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const len2 = dx * dx + dy * dy;
          const t = len2 ? clamp(((target.x - a.x) * dx + (target.y - a.y) * dy) / len2, 0, 1) : 0;
          const px = a.x + dx * t;
          const py = a.y + dy * t;
          const pixelDistance = Math.hypot(target.x - px, target.y - py);
          if (!best || pixelDistance < best.pixelDistance) {
            const segStartKm = routeDistances[i - 1] || 0;
            const segEndKm = routeDistances[i] || segStartKm;
            const distanceAlongKm = segStartKm + (segEndKm - segStartKm) * t;
            const profileIndex = profileIndexFromDistanceKm(distanceAlongKm);
            best = {
              pixelDistance,
              distanceAlongKm,
              profileIndex,
              point: map.layerPointToLatLng(L.point(px, py))
            };
          }
        }
        if (!best || (maxPixels != null && best.pixelDistance > maxPixels)) return null;
        return best;
      }

      function nearestRoutePixelIndex(latlng, maxPixels) {
        const projection = closestRouteProjection(latlng, maxPixels);
        return projection ? projection.profileIndex : -1;
      }

      function formatRideDistance(km) {
        if (!Number.isFinite(km)) return "--";
        if (km < 1) return Math.round(km * 1000) + " m";
        return km.toFixed(1) + " km";
      }

      function nearestRouteInfo(latlng) {
        const projection = closestRouteProjection(latlng);
        if (!projection) return null;
        return {
          index: projection.profileIndex,
          point: projection.point,
          distanceKm: haversineKm(latlng, projection.point),
          distanceAlongKm: projection.distanceAlongKm
        };
      }

      function nextClimbInfo(fromIndex) {
        if (!state.profileElevations.length || state.profileElevations.length < 2) return null;
        const targetGrade = desiredGradeTarget();
        const threshold = targetGrade > 0 ? Math.max(2, targetGrade * 0.55) : 3;
        for (let i = Math.max(1, fromIndex + 1); i < state.profileElevations.length - 1; i += 1) {
          const grade = smoothedProfileGradeAt(i, 0.32);
          if (grade >= threshold) {
            return {
              distanceAheadKm: Math.max(0, (state.profileDistances[i] || 0) - (state.profileDistances[fromIndex] || 0)),
              grade
            };
          }
        }
        return null;
      }

      function ensureRideLayers() {}

      function updateRidePosition(position) {}

      function stopRideMode(message) {
        if (message) setStatus(message);
      }

      function startRideMode() {}

      function toggleRideMode() {}

            function drawProfile(elevations, message) {
        resizeProfile();
        const w = dom.profileCanvas.clientWidth || dom.profileCanvas.parentElement.clientWidth || window.innerWidth;
        const h = dom.profileCanvas.clientHeight || 120;
        profileCtx.clearRect(0, 0, w, h);
        profileCtx.fillStyle = "#040611";
        profileCtx.fillRect(0, 0, w, h);
        updateProfileZoomLabel();
        if (!elevations || elevations.length < 2) {
          profileCtx.fillStyle = "#aaa6d8";
          profileCtx.font = "13px system-ui, sans-serif";
          profileCtx.fillText(message || "Profil pojawi się po pobraniu wysokości.", 12, 28);
          return;
        }
        const displayElevations = state.profileSmoothElevations && state.profileSmoothElevations.length === elevations.length
          ? state.profileSmoothElevations
          : smoothedElevationSeries(elevations, state.profileDistances);
        const zoomRange = profileZoomRange(elevations.length);
        const visibleElevations = displayElevations.slice(zoomRange.start, zoomRange.end + 1);
        const min = Math.min(...visibleElevations);
        const max = Math.max(...visibleElevations);
        const range = Math.max(12, max - min);
        const pad = 11;
        const xDenominator = Math.max(1, zoomRange.end - zoomRange.start);
        const xForIndex = (index) => (index - zoomRange.start) / xDenominator * w;
        const yForValue = (value) => h - pad - (value - min) / range * (h - pad * 2);
        profileCtx.strokeStyle = "rgba(122, 234, 255, 0.16)";
        profileCtx.lineWidth = 1;
        for (let i = 1; i < 4; i += 1) {
          const y = pad + (h - pad * 2) * i / 4;
          profileCtx.beginPath();
          profileCtx.moveTo(0, y);
          profileCtx.lineTo(w, y);
          profileCtx.stroke();
        }
        profileCtx.beginPath();
        for (let index = zoomRange.start; index <= zoomRange.end; index += 1) {
          const x = xForIndex(index);
          const y = yForValue(displayElevations[index]);
          if (index === zoomRange.start) profileCtx.moveTo(x, y);
          else profileCtx.lineTo(x, y);
        }
        profileCtx.lineTo(w, h - pad);
        profileCtx.lineTo(0, h - pad);
        profileCtx.closePath();
        profileCtx.fillStyle = "rgba(47, 134, 255, 0.18)";
        profileCtx.fill();

        profileCtx.lineWidth = 2.5;
        for (let i = zoomRange.start + 1; i <= zoomRange.end; i += 1) {
          const x1 = xForIndex(i - 1);
          const y1 = yForValue(displayElevations[i - 1]);
          const x2 = xForIndex(i);
          const y2 = yForValue(displayElevations[i]);
          const grade = profileGradeAt(i);
          profileCtx.beginPath();
          profileCtx.moveTo(x1, y1);
          profileCtx.lineTo(x2, y2);
          profileCtx.strokeStyle = slopeShadeColor(grade, i / (elevations.length - 1));
          profileCtx.stroke();
        }

        if (zoomRange.zoom > 1.01) {
          const startKm = state.profileDistances[zoomRange.start] || 0;
          const endKm = state.profileDistances[zoomRange.end] || state.profileDistances[state.profileDistances.length - 1] || 0;
          profileCtx.fillStyle = "rgba(122, 234, 255, 0.86)";
          profileCtx.font = "11px system-ui, sans-serif";
          profileCtx.fillText("zoom " + Math.round(zoomRange.zoom * 100) + "% | " + startKm.toFixed(1) + "-" + endKm.toFixed(1) + " km", 12, h - 6);
        }

        if (state.profileHoverIndex >= zoomRange.start && state.profileHoverIndex <= zoomRange.end) {
          const x = xForIndex(state.profileHoverIndex);
          const y = yForValue(displayElevations[state.profileHoverIndex]);
          profileCtx.strokeStyle = "#ff2fb2";
          profileCtx.lineWidth = 1;
          profileCtx.beginPath();
          profileCtx.moveTo(x, pad);
          profileCtx.lineTo(x, h - pad);
          profileCtx.stroke();
          profileCtx.fillStyle = "#f8f4ff";
          profileCtx.beginPath();
          profileCtx.arc(x, y, 4, 0, Math.PI * 2);
          profileCtx.fill();
          profileCtx.strokeStyle = "#050711";
          profileCtx.lineWidth = 2;
          profileCtx.stroke();
        }
      }

      function routeUrl(endpoint, waypoints) {
        const coords = waypoints.map((point) => point.lng.toFixed(6) + "," + point.lat.toFixed(6)).join(";");
        return endpoint + coords + "?overview=full&geometries=geojson&steps=false&alternatives=false&continue_straight=false&generate_hints=false";
      }

      async function callOsrm(waypoints) {
        let lastError = null;
        for (const endpoint of osrmEndpoints) {
          try {
            const data = await fetchJson(routeUrl(endpoint, waypoints), 35000);
            if (!data.routes || !data.routes[0]) {
              throw new Error(data.message || "Brak trasy.");
            }
            const route = data.routes[0];
            return {
              distanceKm: route.distance / 1000,
              durationMin: route.duration / 60,
              latlngs: route.geometry.coordinates.map((coord) => L.latLng(coord[1], coord[0])),
              endpoint
            };
          } catch (error) {
            lastError = error;
          }
        }
        throw lastError || new Error("Nie udało się pobrać trasy.");
      }

      function sampleRoute(latlngs, maxPoints) {
        if (!latlngs || !latlngs.length) return [];
        if (latlngs.length === 1 || maxPoints <= 1) return latlngs.slice(0, 1);
        const samples = [];
        const distances = routeSampleDistances(latlngs);
        const totalKm = distances[distances.length - 1] || 0;
        if (!totalKm) {
          if (latlngs.length <= maxPoints) return latlngs.slice();
          for (let i = 0; i < maxPoints; i += 1) {
            const index = Math.round(i * (latlngs.length - 1) / (maxPoints - 1));
            samples.push(latlngs[index]);
          }
          return samples;
        }
        let segmentIndex = 1;
        for (let i = 0; i < maxPoints; i += 1) {
          const targetKm = totalKm * i / Math.max(1, maxPoints - 1);
          while (segmentIndex < distances.length - 1 && distances[segmentIndex] < targetKm) segmentIndex += 1;
          const prevIndex = Math.max(0, segmentIndex - 1);
          const startKm = distances[prevIndex] || 0;
          const endKm = distances[segmentIndex] || startKm;
          const ratio = endKm > startKm ? (targetKm - startKm) / (endKm - startKm) : 0;
          const a = latlngs[prevIndex];
          const b = latlngs[segmentIndex] || a;
          samples.push(L.latLng(
            a.lat + (b.lat - a.lat) * clamp(ratio, 0, 1),
            a.lng + (b.lng - a.lng) * clamp(ratio, 0, 1)
          ));
        }
        return samples;
      }

      function chunks(items, size) {
        const result = [];
        for (let i = 0; i < items.length; i += size) {
          result.push(items.slice(i, i + size));
        }
        return result;
      }

      function cleanElevations(values) {
        const cleaned = values.map((value) => {
          const number = Number(value);
          return Number.isFinite(number) ? number : null;
        });
        for (let i = 0; i < cleaned.length; i += 1) {
          if (cleaned[i] == null && i > 0) cleaned[i] = cleaned[i - 1];
        }
        for (let i = cleaned.length - 1; i >= 0; i -= 1) {
          if (cleaned[i] == null && i < cleaned.length - 1) cleaned[i] = cleaned[i + 1];
        }
        return cleaned.filter((value) => value != null);
      }

      async function fetchOpenMeteoElevations(samples) {
        const elevations = [];
        for (const part of chunks(samples, 45)) {
          const lat = part.map((point) => point.lat.toFixed(5)).join(",");
          const lng = part.map((point) => point.lng.toFixed(5)).join(",");
          const url = "https://api.open-meteo.com/v1/elevation?latitude=" + encodeURIComponent(lat) + "&longitude=" + encodeURIComponent(lng);
          const data = await fetchJsonRetry(url, 12000, 1, 1200);
          if (!Array.isArray(data.elevation)) throw new Error("Open-Meteo bez danych wysokości.");
          elevations.push(...cleanElevations(data.elevation));
          await waitMs(250);
        }
        return elevations;
      }

      async function fetchOpenTopoDatasetElevations(samples, dataset) {
        const elevations = [];
        for (const part of chunks(samples, 45)) {
          const locations = part.map((point) => point.lat.toFixed(5) + "," + point.lng.toFixed(5)).join("|");
          const url = "https://api.opentopodata.org/v1/" + dataset + "?locations=" + encodeURIComponent(locations);
          const data = await fetchJsonRetry(url, 14000, 1, 1200);
          if (!Array.isArray(data.results)) throw new Error("OpenTopoData " + dataset + " bez danych wysokości.");
          elevations.push(...cleanElevations(data.results.map((item) => item && item.elevation)));
          await waitMs(250);
        }
        return elevations;
      }

      async function fetchOpenTopoEudemElevations(samples) {
        return fetchOpenTopoDatasetElevations(samples, "eudem25m");
      }

      async function fetchOpenTopoAsterElevations(samples) {
        return fetchOpenTopoDatasetElevations(samples, "aster30m");
      }

      async function fetchOpenTopoSrtmElevations(samples) {
        return fetchOpenTopoDatasetElevations(samples, "srtm90m");
      }

      async function fetchOpenElevationElevations(samples) {
        const elevations = [];
        for (const part of chunks(samples, 45)) {
          const data = await postJsonRetry("https://api.open-elevation.com/api/v1/lookup", {
            locations: part.map((point) => ({
              latitude: Number(point.lat.toFixed(5)),
              longitude: Number(point.lng.toFixed(5))
            }))
          }, 14000, 1, 1200);
          if (!Array.isArray(data.results)) throw new Error("Open-Elevation bez danych wysokości.");
          elevations.push(...cleanElevations(data.results.map((item) => item && item.elevation)));
          await waitMs(250);
        }
        return elevations;
      }

      async function fetchElevations(latlngs) {
        const distanceKm = routeDistanceKm(latlngs);
        const sampleCounts = [
          clamp(Math.round(distanceKm * 2.0), 100, 260),
          clamp(Math.round(distanceKm * 1.25), 80, 180),
          90,
          60
        ].filter((value, index, list) => list.indexOf(value) === index);
        const providers = [
          fetchOpenTopoEudemElevations,
          fetchOpenTopoAsterElevations,
          fetchOpenTopoSrtmElevations,
          fetchOpenElevationElevations,
          fetchOpenMeteoElevations
        ];
        let lastError = null;
        for (const sampleCount of sampleCounts) {
          const samples = sampleRoute(latlngs, sampleCount);
          if (!samples.length) continue;
          for (const provider of providers) {
            try {
              dom.profileInfo.textContent = "pobieram realne wysokości: " + sampleCount + " próbek...";
              const elevations = await provider(samples);
              if (elevations.length >= Math.max(12, Math.floor(samples.length * 0.85))) {
                return elevations.slice(0, samples.length);
              }
            } catch (error) {
              lastError = error;
            }
          }
        }
        throw lastError || new Error("Brak danych wysokości.");
      }

      function makeEstimatedElevations(latlngs) {
        const samples = sampleRoute(latlngs, 90);
        if (samples.length < 2) return [];
        const start = samples[0];
        const seed = Math.abs(Math.sin(toRad(start.lat * 17.13 + start.lng * 9.71)));
        const base = 105 + seed * 85;
        const elevations = [];
        let distance = 0;

        for (let i = 0; i < samples.length; i += 1) {
          if (i > 0) distance += haversineKm(samples[i - 1], samples[i]);
          const point = samples[i];
          const broad = Math.sin(distance * 0.18 + seed * Math.PI * 2) * 12;
          const local = Math.sin((point.lat + point.lng) * 18 + distance * 0.55) * 5;
          const soft = Math.cos(distance * 0.07 + point.lat * 3) * 7;
          elevations.push(Math.round(base + broad + local + soft));
        }

        return elevations;
      }

      function emptyOsmStats() {
        return {
          osmAvailable: false,
          roadScore: 0,
          roadRiskKm: 0,
          roadRiskPercent: 0,
          forbiddenKm: 0,
          nationalKm: 0,
          voivodeshipKm: 0,
          mainRoadKm: 0,
          localRoadKm: 0,
          pavedKm: 0,
          unpavedKm: 0,
          unknownSurfaceKm: 0,
          bikeKm: 0,
          forestKm: 0,
          forestUnpavedKm: 0,
          unknownRoadKm: 0,
          roadSamples: []
        };
      }

      function routeCacheKey(route) {
        const samples = sampleRoute(route, 18);
        return samples.map((point) => point.lat.toFixed(3) + "," + point.lng.toFixed(3)).join("|");
      }

      function buildOverpassQuery(route) {
        const samples = sampleRoute(route, 24);
        const path = samples.map((point) => point.lat.toFixed(5) + "," + point.lng.toFixed(5)).join(",");
        return [
          "[out:json][timeout:25];",
          "(",
          "  way(around:95," + path + ";",
          "  way(around:120," + path + ")[\"route\"=\"bicycle\"];",
          "  way(around:120," + path + ")[\"lcn\"];",
          "  way(around:120," + path + ")[\"rcn\"];",
          "  way(around:120," + path + ")[\"ncn\"];",
          "  way(around:130," + path + ")[\"landuse\"=\"forest\"];",
          "  way(around:130," + path + ")[\"natural\"=\"wood\"];",
          ");",
          "out tags geom;"
        ].join("\n");
      }

      function prepareOsmElements(elements) {
        const roads = [];
        const forests = [];
        for (const element of elements || []) {
          if (element.type !== "way" || !element.geometry || element.geometry.length < 2) continue;
          const tags = element.tags || {};
          const geometry = element.geometry.map((point) => L.latLng(point.lat, point.lon));
          if (tags.highway) {
            roads.push({ tags, geometry });
          }
          if (tags.landuse === "forest" || tags.natural === "wood") {
            forests.push({ tags, geometry });
          }
        }
        return { roads, forests };
      }

      function distancePointToSegmentKm(point, a, b) {
        const aa = latLngToXy(a, point);
        const bb = latLngToXy(b, point);
        const dx = bb.x - aa.x;
        const dy = bb.y - aa.y;
        const denom = dx * dx + dy * dy;
        if (denom === 0) return Math.hypot(aa.x, aa.y);
        const t = clamp(-(aa.x * dx + aa.y * dy) / denom, 0, 1);
        const x = aa.x + dx * t;
        const y = aa.y + dy * t;
        return Math.hypot(x, y);
      }

      function distanceToWayKm(point, way) {
        let best = Infinity;
        for (let i = 1; i < way.geometry.length; i += 1) {
          best = Math.min(best, distancePointToSegmentKm(point, way.geometry[i - 1], way.geometry[i]));
          if (best < 0.018) break;
        }
        return best;
      }

      function nearestRoad(point, roads) {
        let best = null;
        let bestKm = Infinity;
        for (const road of roads) {
          const distanceKm = distanceToWayKm(point, road);
          if (distanceKm < bestKm) {
            bestKm = distanceKm;
            best = road;
          }
        }
        return best && bestKm <= 0.13 ? { road: best, distanceKm: bestKm } : null;
      }

      function pointInPolygon(point, polygon) {
        let inside = false;
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i, i += 1) {
          const xi = polygon[i].lng;
          const yi = polygon[i].lat;
          const xj = polygon[j].lng;
          const yj = polygon[j].lat;
          const crosses = ((yi > point.lat) !== (yj > point.lat)) && (point.lng < (xj - xi) * (point.lat - yi) / ((yj - yi) || 1e-9) + xi);
          if (crosses) inside = !inside;
        }
        return inside;
      }

      function isInForest(point, forests) {
        for (const forest of forests) {
          const geometry = forest.geometry;
          if (geometry.length > 3 && haversineKm(geometry[0], geometry[geometry.length - 1]) < 0.05 && pointInPolygon(point, geometry)) {
            return true;
          }
          if (distanceToWayKm(point, forest) < 0.045) {
            return true;
          }
        }
        return false;
      }

      function classifyRoad(tags) {
        const highway = tags.highway || "";
        const surface = (tags.surface || "").toLowerCase();
        const tracktype = (tags.tracktype || "").toLowerCase();
        const smoothness = (tags.smoothness || "").toLowerCase();
        const bicycle = (tags.bicycle || "").toLowerCase();
        const access = (tags.access || "").toLowerCase();
        const ref = String(tags.ref || tags.nat_ref || "").toUpperCase();
        let risk = 2.5;
        let local = false;
        let main = false;
        let forbidden = false;
        let national = false;
        let voivodeship = false;
        let bike = false;
        let unpaved = false;
        let paved = false;
        let unknownSurface = false;

        if (forbiddenHighways.has(highway) || /\b(A|S)\s*\d+/i.test(ref)) {
          risk = 14;
          forbidden = true;
          main = true;
        } else if (nationalHighways.has(highway) || /\bDK\s*\d+/i.test(ref)) {
          risk = 8.5;
          national = true;
          main = true;
        } else if (voivodeshipHighways.has(highway) || /\bDW\s*\d+/i.test(ref)) {
          risk = 5.2;
          voivodeship = true;
        } else if (localHighways.has(highway)) {
          risk = 1.1;
          local = true;
        } else if (highway === "track") {
          risk = 6.2;
        } else if (["path", "footway", "bridleway", "steps", "pedestrian"].includes(highway)) {
          risk = 6.8;
        }

        if (highway === "cycleway" || bicycle === "designated" || bicycle === "yes" || bicycle === "permissive" || tags.cycleway || tags["cycleway:left"] || tags["cycleway:right"] || tags.route === "bicycle" || tags.lcn || tags.rcn || tags.ncn || tags.icn) {
          bike = true;
          risk -= 2.2;
        }

        if (tracktype === "grade1") {
          paved = true;
          risk -= 0.4;
        } else if (["grade3", "grade4", "grade5"].includes(tracktype)) {
          unpaved = true;
          risk += tracktype === "grade5" ? 5 : 3.4;
        } else if (tracktype === "grade2" && !pavedSurfaces.has(surface)) {
          unknownSurface = true;
          risk += 1.2;
        }

        if (pavedSurfaces.has(surface)) {
          paved = true;
          risk -= 0.9;
        } else if (roughSurfaces.has(surface)) {
          risk += surface === "sand" ? 6 : 4;
          unpaved = true;
        } else if ((highway === "track" || highway === "path") && !bike) {
          risk += 2.3;
          unpaved = true;
        } else if (!surface && !forbidden && !national && !voivodeship && !bike) {
          unknownSurface = true;
        }

        if (access === "private" || access === "no") {
          risk += 4;
          forbidden = true;
        }

        if (["bad", "very_bad", "horrible", "very_horrible", "impassable"].includes(smoothness)) {
          risk += 2.4;
          if (!paved) unpaved = true;
        }

        return {
          highway,
          surface,
          risk: clamp(risk, 0, 14),
          main,
          forbidden,
          national,
          voivodeship,
          local,
          bike,
          paved,
          unpaved,
          unknownSurface
        };
      }

      async function analyzeOsmForRoute(route, distanceKm) {
        if (!route.length) return emptyOsmStats();
        const key = routeCacheKey(route);
        if (state.osmCache.has(key)) {
          return state.osmCache.get(key);
        }

        const query = buildOverpassQuery(route);
        const data = await fetchOverpass(query, { fast: true, timeoutMs: 12000 });
        const prepared = prepareOsmElements(data.elements);
        const samples = sampleRoute(route, Math.min(72, Math.max(18, Math.round(distanceKm))));
        const weightKm = distanceKm / Math.max(1, samples.length);
        const stats = emptyOsmStats();
        stats.osmAvailable = true;

        for (const sample of samples) {
          const nearest = nearestRoad(sample, prepared.roads);
          const forestSample = isInForest(sample, prepared.forests);
          let sampleInfo = {
            lat: Number(sample.lat.toFixed(6)),
            lng: Number(sample.lng.toFixed(6)),
            risk: 3.2,
            forest: forestSample,
            main: false,
            forbidden: false,
            national: false,
            voivodeship: false,
            local: false,
            bike: false,
            unpaved: false,
            unknownRoad: false,
            unknownSurface: false
          };
          if (!nearest) {
            stats.unknownRoadKm += weightKm;
            stats.roadScore += weightKm * 3.2;
            sampleInfo.unknownRoad = true;
          } else {
            const road = classifyRoad(nearest.road.tags);
            stats.roadScore += road.risk * weightKm;
            if (road.risk >= 4.8) stats.roadRiskKm += weightKm;
            if (road.main) stats.mainRoadKm += weightKm;
            if (road.forbidden) stats.forbiddenKm += weightKm;
            if (road.national) stats.nationalKm += weightKm;
            if (road.voivodeship) stats.voivodeshipKm += weightKm;
            if (road.local) stats.localRoadKm += weightKm;
            if (road.paved) stats.pavedKm += weightKm;
            if (road.unpaved) stats.unpavedKm += weightKm;
            if (road.unknownSurface) stats.unknownSurfaceKm += weightKm;
            if (road.bike) stats.bikeKm += weightKm;
            if (road.unpaved && forestSample) stats.forestUnpavedKm += weightKm;
            sampleInfo = {
              ...sampleInfo,
              risk: road.risk,
              main: road.main,
              forbidden: road.forbidden,
              national: road.national,
              voivodeship: road.voivodeship,
              local: road.local,
              bike: road.bike,
              unpaved: road.unpaved,
              unknownSurface: road.unknownSurface,
              highway: road.highway,
              surface: road.surface
            };
          }

          if (forestSample) {
            stats.forestKm += weightKm;
          }
          stats.roadSamples.push(sampleInfo);
        }

        const riskKm = stats.roadRiskKm + stats.forbiddenKm * 4 + stats.nationalKm * 1.8 + stats.voivodeshipKm * 0.9 + stats.unpavedKm * 1.4 + stats.forestKm * 1.4 + stats.forestUnpavedKm * 2.4 + stats.unknownRoadKm * 0.35 + stats.unknownSurfaceKm * 0.25;
        stats.roadRiskPercent = clamp((riskKm / Math.max(distanceKm, 0.1)) * 100, 0, 100);
        state.osmCache.set(key, stats);
        return stats;
      }

      function desiredGradeTarget() {
        return clamp(Number(dom.targetGrade.value) || 0, 0, 30);
      }

      function measureStats(route, osrmDistanceKm, elevations, osmStats) {
        let maxRadiusKm = 0;
        for (const point of route) {
          maxRadiusKm = Math.max(maxRadiusKm, haversineKm(state.start, point));
        }

        let ascentM = 0;
        let maxGrade = 0;
        let steepKm = 0;
        let smoothElevations = Array.isArray(elevations) ? elevations.slice() : [];
        const gradeLimit = clamp(Number(dom.maxGrade.value) || 4, 1, 30);
        if (elevations.length > 1) {
          const sampled = sampleRoute(route, elevations.length);
          const distances = routeSampleDistances(sampled);
          const totalProfileKm = distances[distances.length - 1] || osrmDistanceKm || routeDistanceKm(sampled);
          const gradeWindow = Math.max(0.32, gradeWindowForDistance(totalProfileKm));
          smoothElevations = smoothedElevationSeries(elevations, distances, Math.max(0.18, gradeWindow * 0.62));
          const stableGrades = [];
          for (let i = 1; i < elevations.length; i += 1) {
            const segmentKm = Math.max(0.001, (distances[i] || 0) - (distances[i - 1] || 0));
            const dz = smoothElevations[i] - smoothElevations[i - 1];
            if (dz > elevationNoiseThreshold(segmentKm)) ascentM += dz;
            const grade = Math.abs(stableGradeFromArrays(smoothElevations, distances, i, gradeWindow));
            stableGrades.push(grade);
            if (grade > gradeLimit && segmentKm >= 0.02) {
              steepKm += segmentKm;
            }
          }
          maxGrade = robustGradeMax(stableGrades);
        }
        return {
          distanceKm: osrmDistanceKm,
          maxRadiusKm,
          ascentM,
          maxGrade,
          steepKm,
          elevations,
          smoothElevations,
          elevationEstimated: false,
          ...emptyOsmStats(),
          ...(osmStats || {})
        };
      }

      function scoreStats(stats, targetKm, maxRadiusKm) {
        const distanceError = Math.abs(stats.distanceKm - targetKm);
        const distanceTolerance = Math.max(3, targetKm * 0.08);
        const distanceExcess = Math.max(0, distanceError - distanceTolerance);
        const heavyOvershoot = Math.max(0, stats.distanceKm - targetKm * 1.12);
        const distancePenalty = distanceError * 120 + distanceExcess ** 2 * 45 + heavyOvershoot ** 2 * 90;
        const flatWeight = Number(dom.flatWeight.value) / 100;
        const radiusPenalty = state.areaPoints.length >= 3 ? 0 : Math.max(0, stats.maxRadiusKm - maxRadiusKm);
        const gradeLimit = clamp(Number(dom.maxGrade.value) || 4, 1, 30);
        const targetGrade = desiredGradeTarget();
        const strictness = (Number(dom.roadStrictness.value) || 8) / 10;
        const preset = dom.routePreset.value;
        const steepPenalty = Math.max(0, stats.maxGrade - gradeLimit) ** 2 * (50 + flatWeight * 120) + (stats.steepKm || 0) * (80 + flatWeight * 180);
        const climbGoalPenalty = targetGrade > 0
          ? Math.max(0, targetGrade - stats.maxGrade) ** 2 * (95 + (1 - flatWeight) * 130) + Math.max(0, targetGrade * 0.55 - (stats.steepKm || 0) * 10) * 42
          : 0;
        const climbGoalBonus = targetGrade > 0 && stats.maxGrade >= targetGrade * 0.82
          ? -Math.min(900, stats.maxGrade * 40 + (stats.ascentM || 0) * 0.32)
          : 0;
        let roadPenalty = 0;
        const uncertainKm = (stats.unknownRoadKm || 0) + (stats.unknownSurfaceKm || 0);
        const predictabilityPressure = dom.preferAsphalt.checked ? 1.45 : preset === "adventure" ? 0.55 : 1;
        roadPenalty += (stats.unknownRoadKm || 0) * 320 * predictabilityPressure;
        roadPenalty += (stats.unknownSurfaceKm || 0) * 180 * predictabilityPressure;
        roadPenalty += Math.max(0, uncertainKm - targetKm * 0.08) ** 2 * 85 * predictabilityPressure;

        roadPenalty += (stats.forbiddenKm || 0) * 5200;
        if (dom.avoidNationalRoads.checked) {
          roadPenalty += (stats.nationalKm || 0) * (900 + strictness * 1200);
          roadPenalty += (stats.roadRiskKm || 0) * (35 + strictness * 70);
        }
        if (dom.avoidVoivodeshipRoads.checked) {
          roadPenalty += (stats.voivodeshipKm || 0) * (360 + strictness * 620);
        }
        if (dom.avoidForestAuto.checked) {
          roadPenalty += (stats.forestKm || 0) * (preset === "road" ? 1600 : 1050);
          roadPenalty += (stats.forestUnpavedKm || 0) * (preset === "adventure" ? 2600 : 6200);
          roadPenalty += Math.max(0, (stats.forestKm || 0) - 0.2) ** 2 * 850;
        }
        if (dom.preferAsphalt.checked) {
          roadPenalty += (stats.unpavedKm || 0) * (preset === "road" ? 3200 : 2200);
          roadPenalty += (stats.forestUnpavedKm || 0) * 8200;
          roadPenalty += (stats.unknownRoadKm || 0) * (preset === "road" ? 720 : 460);
          roadPenalty += (stats.unknownSurfaceKm || 0) * (preset === "road" ? 380 : 240);
          roadPenalty += Math.max(0, (stats.unpavedKm || 0) - 0.12) ** 2 * 1900;
          roadPenalty -= (stats.pavedKm || 0) * 18;
        }
        if (dom.preferBikeRoutes.checked) {
          roadPenalty -= (stats.bikeKm || 0) * 24;
          roadPenalty -= (stats.localRoadKm || 0) * 6;
        }
        if (preset === "road") {
          roadPenalty += (stats.nationalKm || 0) * 260;
          roadPenalty += (stats.voivodeshipKm || 0) * 180;
          roadPenalty += (stats.forestKm || 0) * 680;
          roadPenalty += (stats.unpavedKm || 0) * 1100;
          roadPenalty += (stats.forestUnpavedKm || 0) * 2400;
          roadPenalty += (stats.unknownRoadKm || 0) * 180;
          roadPenalty += (stats.unknownSurfaceKm || 0) * 90;
          roadPenalty -= (stats.bikeKm || 0) * 38;
          roadPenalty -= (stats.localRoadKm || 0) * 14;
        }
        if (preset === "adventure") {
          roadPenalty -= (stats.forestKm || 0) * 95;
          roadPenalty -= (stats.unpavedKm || 0) * 70;
          roadPenalty -= (stats.bikeKm || 0) * 18;
          roadPenalty += (stats.nationalKm || 0) * 220;
          roadPenalty += (stats.roadRiskKm || 0) * 18;
        }
        if (preset === "scenic") {
          roadPenalty -= (stats.localRoadKm || 0) * 28;
          roadPenalty -= (stats.bikeKm || 0) * 36;
          roadPenalty -= (stats.pavedKm || 0) * 10;
          roadPenalty += (stats.nationalKm || 0) * 420;
          roadPenalty += (stats.voivodeshipKm || 0) * 120;
          roadPenalty += (stats.unpavedKm || 0) * 1350;
          roadPenalty += (stats.forestUnpavedKm || 0) * 3800;
          roadPenalty += (stats.unknownRoadKm || 0) * 220;
        }

        return distancePenalty
          + stats.ascentM * (0.14 + flatWeight * 0.62)
          + stats.maxGrade * (targetGrade > 0 ? 4 + flatWeight * 8 : 12 + flatWeight * 30)
          + steepPenalty
          + climbGoalPenalty
          + climbGoalBonus
          + radiusPenalty * 220
          + roadPenalty
          + (stats.roadScore || 0) * 12;
      }

      async function addOsmStats(result) {
        const osmStats = await analyzeOsmForRoute(result.routed.latlngs, result.routed.distanceKm);
        result.stats = measureStats(result.routed.latlngs, result.routed.distanceKm, result.stats.elevations, osmStats);
        return result;
      }

      async function analyzeVariantOsmBatch(variants, targetKm, maxRadiusKm, label, scorer) {
        let completed = 0;
        let warned = false;
        await mapConcurrent(variants, osmAnalysisConcurrency, async (variant, index) => {
          setStatus(label + " " + (index + 1) + "/" + variants.length + ": klasy dróg, asfalt, las i rowerowe oznaczenia...");
          try {
            await addOsmStats(variant.result);
          } catch (error) {
            if (!warned) {
              setStatus("Overpass nie odpowiedział dla części wariantów, liczę dalej na dostępnych danych.", "warn");
              warned = true;
            }
          }
          variant.score = scorer ? scorer(variant) : candidateScore(variant.result, targetKm, maxRadiusKm);
          completed += 1;
          setStatus(label + " " + completed + "/" + variants.length + " zakończona...");
          return variant;
        });
        return variants;
      }

      function osmStatsFrom(stats) {
        const osmStats = emptyOsmStats();
        for (const key of Object.keys(osmStats)) {
          osmStats[key] = stats && stats[key] != null ? stats[key] : osmStats[key];
        }
        return osmStats;
      }

      async function routeAndMeasure(waypoints, options) {
        const analyzeOsm = !options || options.analyzeOsm !== false;
        const routed = await callOsrm(waypoints);
        let osmStats = emptyOsmStats();
        if (analyzeOsm) {
          try {
            osmStats = await analyzeOsmForRoute(routed.latlngs, routed.distanceKm);
          } catch (error) {
            setStatus("Trasa jest, ale analiza OSM/Overpass nie odpowiedziała. Oceniam tylko dystans.", "warn");
          }
        }
        const stats = measureStats(routed.latlngs, routed.distanceKm, [], osmStats);
        return { routed, stats };
      }

      async function loadElevationProfile(routeLatLngs, baseStats, source) {
        if (!routeLatLngs || routeLatLngs.length < 2) return;
        const requestId = ++state.profileRequestId;
        const estimatedElevations = makeEstimatedElevations(routeLatLngs);
        if (estimatedElevations.length >= 2) {
          const estimatedStats = measureStats(routeLatLngs, baseStats.distanceKm, estimatedElevations, osmStatsFrom(baseStats));
          estimatedStats.elevationEstimated = true;
          setRoute(routeLatLngs, estimatedStats, source || "OSRM bike");
          dom.profileInfo.textContent = "profil orientacyjny, pobieram realne wysokości...";
        } else {
          dom.profileInfo.textContent = "pobieram wysokości...";
          drawProfile([], "Pobieram profil wysokości w tle...");
        }
        try {
          const elevations = await fetchElevations(routeLatLngs);
          if (requestId !== state.profileRequestId) return;
          const stats = measureStats(routeLatLngs, baseStats.distanceKm, elevations, osmStatsFrom(baseStats));
          stats.elevationEstimated = false;
          setRoute(routeLatLngs, stats, source || "OSRM bike");
        } catch (error) {
          if (requestId !== state.profileRequestId) return;
          if (estimatedElevations.length >= 2) {
            dom.profileInfo.textContent = "profil orientacyjny, DEM niedostępny";
            setStatus("Trasa jest gotowa. Realne wysokości nie odpowiedziały, zostawiłem profil orientacyjny.", "warn");
          } else {
            dom.profileInfo.textContent = "wysokości niedostępne";
            drawProfile([], "Nie udało się pobrać wysokości. Trasa jest gotowa, profil spróbuje ponownie przy kolejnym przeliczeniu.");
            setStatus("Trasa jest gotowa, ale profil wysokości nie odpowiedział: " + error.message, "warn");
          }
        }
      }

      async function routeCurrentWaypoints(message, options) {
        if (state.busy || state.waypoints.length < 2) return;
        if (isPointMode() && !state.finish) {
          setStatus("Najpierw ustaw metę: wpisz adres mety albo kliknij Meta z mapy.", "warn");
          return;
        }
        try {
          setBusy(true);
          configureBusyTimer(isCustomMode() ? "Przeliczam własną trasę" : (isPointMode() ? "Przeliczam A→B" : "Przeliczam trasę"), 18);
          setStatus("Liczenie trasy po realnych drogach...");
          drawGuide(state.waypoints, false);
          const result = await routeAndMeasure(state.waypoints, { analyzeOsm: false });
          setRoute(result.routed.latlngs, result.stats, "OSRM bike");
          const bounds = L.latLngBounds(result.routed.latlngs.concat(state.waypoints));
          if (options && options.fit && bounds.isValid()) map.fitBounds(bounds.pad(0.12));
          setStatus((message || "Trasa przeliczona po drogach OSM.") + " Profil wysokości ładuje się w tle.");
          loadElevationProfile(result.routed.latlngs, result.stats, "OSRM bike");
        } catch (error) {
          setStatus("Nie udało się wyznaczyć trasy: " + error.message, "bad");
        } finally {
          setBusy(false);
        }
      }

      function cancelCustomRouteTimer() {
        if (state.customRouteTimerId) {
          window.clearTimeout(state.customRouteTimerId);
          state.customRouteTimerId = null;
        }
      }

      function scheduleCustomRoute(message) {
        cancelCustomRouteTimer();
        if (!isCustomMode()) return;
        if (state.waypoints.length < 2) {
          setStatus("Własna trasa: kliknij mapę, żeby dodać pierwszy punkt za startem S.", "warn");
          return;
        }
        drawGuide(state.waypoints, false);
        setStatus("Punkt dodany. Szkic jest od razu, a przeliczenie po drogach ruszy po krótkiej pauzie po ostatnim kliknięciu.");
        state.customRouteTimerId = window.setTimeout(async () => {
          state.customRouteTimerId = null;
          if (!isCustomMode()) return;
          if (state.busy) {
            scheduleCustomRoute(message || "Własna trasa przeliczona po klikniętych punktach.");
            return;
          }
          await routeCurrentWaypoints(message || "Własna trasa przeliczona po klikniętych punktach.");
        }, 320);
      }

      function areaCentroid() {
        const total = state.areaPoints.reduce((acc, point) => {
          acc.lat += point.lat;
          acc.lng += point.lng;
          return acc;
        }, { lat: 0, lng: 0 });
        return L.latLng(total.lat / state.areaPoints.length, total.lng / state.areaPoints.length);
      }

      function areaFrame(origin) {
        let minX = Infinity;
        let maxX = -Infinity;
        let minY = Infinity;
        let maxY = -Infinity;

        for (const point of state.areaPoints) {
          const xy = latLngToXy(point, origin);
          minX = Math.min(minX, xy.x);
          maxX = Math.max(maxX, xy.x);
          minY = Math.min(minY, xy.y);
          maxY = Math.max(maxY, xy.y);
        }

        if (maxX - minX < 1.2) {
          const middle = (minX + maxX) / 2;
          minX = middle - 0.6;
          maxX = middle + 0.6;
        }
        if (maxY - minY < 1.2) {
          const middle = (minY + maxY) / 2;
          minY = middle - 0.6;
          maxY = middle + 0.6;
        }

        const spanX = maxX - minX;
        const spanY = maxY - minY;
        const padX = Math.max(spanX * 0.1, 0.25);
        const padY = Math.max(spanY * 0.1, 0.25);

        return {
          minX: minX - padX,
          maxX: maxX + padX,
          minY: minY - padY,
          maxY: maxY + padY,
          centerX: (minX + maxX) / 2,
          centerY: (minY + maxY) / 2
        };
      }

      function waypointDistanceKm(points) {
        let distance = 0;
        for (let i = 1; i < points.length; i += 1) {
          distance += haversineKm(points[i - 1], points[i]);
        }
        return distance;
      }

      function routeDistanceKm(points) {
        return waypointDistanceKm(points || []);
      }

      function routePointAtDistance(points, targetKm) {
        if (!points || !points.length) return null;
        if (points.length === 1 || targetKm <= 0) {
          return { point: points[0], bearing: points.length > 1 ? bearingDeg(points[0], points[1]) : 0 };
        }
        let covered = 0;
        for (let i = 1; i < points.length; i += 1) {
          const a = points[i - 1];
          const b = points[i];
          const segmentKm = haversineKm(a, b);
          if (covered + segmentKm >= targetKm) {
            const t = segmentKm > 0 ? clamp((targetKm - covered) / segmentKm, 0, 1) : 0;
            return {
              point: L.latLng(a.lat + (b.lat - a.lat) * t, a.lng + (b.lng - a.lng) * t),
              bearing: bearingDeg(a, b)
            };
          }
          covered += segmentKm;
        }
        return { point: points[points.length - 1], bearing: bearingDeg(points[Math.max(0, points.length - 2)], points[points.length - 1]) };
      }

      function weatherCodeInfo(code) {
        if (typeof code === "string") {
          if (code.includes("rain")) return { icon: "☔", text: "deszcz" };
          if (code.includes("snow")) return { icon: "❄", text: "śnieg" };
          if (code.includes("cloud")) return { icon: "☁", text: "pochmurno" };
          if (code.includes("fair")) return { icon: "🌤", text: "przejaśnienia" };
          if (code.includes("clearsky")) return { icon: "☀", text: "bezchmurnie" };
        }
        const value = Number(code);
        if (value === 0) return { icon: "☀", text: "bezchmurnie" };
        if ([1, 2].includes(value)) return { icon: "🌤", text: "częściowe chmury" };
        if (value === 3) return { icon: "☁", text: "pochmurno" };
        if ([45, 48].includes(value)) return { icon: "≋", text: "mgła" };
        if ([51, 53, 55, 56, 57].includes(value)) return { icon: "☂", text: "mżawka" };
        if ([61, 63, 65, 66, 67, 80, 81, 82].includes(value)) return { icon: "☔", text: "deszcz" };
        if ([71, 73, 75, 77, 85, 86].includes(value)) return { icon: "❄", text: "śnieg" };
        if ([95, 96, 99].includes(value)) return { icon: "⚡", text: "burza" };
        return { icon: "◌", text: "prognoza" };
      }

      function angleDifference(a, b) {
        return Math.abs(((a - b + 540) % 360) - 180);
      }

      function windRelativeDetails(windFromDeg, routeBearingDeg) {
        const rawFrom = Number(windFromDeg);
        const rawBearing = Number(routeBearingDeg);
        if (!Number.isFinite(rawFrom) || !Number.isFinite(rawBearing)) {
          return { text: "brak danych", tone: "warn", icon: "?", side: "", windTo: 0, windFrom: null, fromText: "--", relFrom: 0 };
        }
        const from = ((rawFrom % 360) + 360) % 360;
        const bearing = ((rawBearing % 360) + 360) % 360;
        const windTo = (from + 180) % 360;
        const relFrom = ((from - bearing + 540) % 360) - 180;
        const absFrom = Math.abs(relFrom);
        const side = relFrom < 0 ? "lewy bok" : "prawy bok";
        let text = side;
        let tone = "warn";
        let icon = "↔";
        if (absFrom <= 30) {
          text = "w twarz";
          tone = "bad";
          icon = "↘";
        } else if (absFrom >= 150) {
          text = "w plecy";
          tone = "good";
          icon = "↗";
        } else if (absFrom <= 68) {
          text = side + " + w twarz";
          tone = "bad";
          icon = "↘";
        } else if (absFrom >= 112) {
          text = side + " + w plecy";
          tone = "good";
          icon = "↗";
        }
        return { text, tone, icon, side, windTo, windFrom: from, fromText: windCompassText(from), relFrom };
      }

      function windRideInfo(windFromDeg, routeBearingDeg) {
        const detail = windRelativeDetails(windFromDeg, routeBearingDeg);
        return { text: detail.text, tone: detail.tone, icon: detail.icon, side: detail.side, arrowDeg: detail.windTo, windFrom: detail.windFrom, fromText: detail.fromText };
      }

      function routeBearingText(deg) {
        return windCompassText(deg);
      }

      function windCompassText(deg) {
        if (!Number.isFinite(Number(deg))) return "--";
        const labels = ["Płn", "Płn-Wsch", "Wsch", "Pd-Wsch", "Pd", "Pd-Zach", "Zach", "Płn-Zach"];
        const normalized = ((Number(deg) % 360) + 360) % 360;
        return labels[Math.round(normalized / 45) % labels.length];
      }

      function nearestHourlyWeather(hourly, eta) {
        if (!hourly || !Array.isArray(hourly.time) || !hourly.time.length) return null;
        let bestIndex = 0;
        let bestDelta = Infinity;
        for (let i = 0; i < hourly.time.length; i += 1) {
          const time = new Date(hourly.time[i]).getTime();
          const delta = Math.abs(time - eta.getTime());
          if (delta < bestDelta) {
            bestDelta = delta;
            bestIndex = i;
          }
        }
        return {
          time: hourly.time[bestIndex],
          temperature: Number(hourly.temperature_2m && hourly.temperature_2m[bestIndex]),
          rainChance: Number(hourly.precipitation_probability && hourly.precipitation_probability[bestIndex]),
          precipitation: Number(hourly.precipitation && hourly.precipitation[bestIndex]),
          windSpeed: Number(hourly.wind_speed_10m && hourly.wind_speed_10m[bestIndex]),
          windGust: Number(hourly.wind_gusts_10m && hourly.wind_gusts_10m[bestIndex]),
          windDirection: Number(hourly.wind_direction_10m && hourly.wind_direction_10m[bestIndex]),
          code: Number(hourly.weather_code && hourly.weather_code[bestIndex])
        };
      }

      function weatherCacheKey(samples) {
        return samples.map((sample) => [
          sample.point.lat.toFixed(3),
          sample.point.lng.toFixed(3),
          Math.round(sample.distanceKm),
          weatherHourCacheStamp(sample.eta)
        ].join(":")).join("|");
      }

      function weatherHourCacheStamp(value) {
        const date = value instanceof Date ? value : new Date(value);
        return Number.isNaN(date.getTime()) ? "--" : date.toISOString().slice(0, 13);
      }

      function normalizeWeatherLocations(response) {
        if (Array.isArray(response)) return response;
        if (response && Array.isArray(response.latitude) && Array.isArray(response.longitude)) {
          return response.latitude.map((_, index) => ({
            ...response,
            latitude: response.latitude[index],
            longitude: response.longitude[index],
            generationtime_ms: Array.isArray(response.generationtime_ms) ? response.generationtime_ms[index] : response.generationtime_ms,
            utc_offset_seconds: Array.isArray(response.utc_offset_seconds) ? response.utc_offset_seconds[index] : response.utc_offset_seconds,
            timezone: Array.isArray(response.timezone) ? response.timezone[index] : response.timezone,
            timezone_abbreviation: Array.isArray(response.timezone_abbreviation) ? response.timezone_abbreviation[index] : response.timezone_abbreviation,
            elevation: Array.isArray(response.elevation) ? response.elevation[index] : response.elevation,
            hourly: Array.isArray(response.hourly) ? response.hourly[index] : response.hourly
          }));
        }
        return response ? [response] : [];
      }

      function weatherRouteSamples() {
        const route = state.routeLatLngs.length >= 2 ? state.routeLatLngs : state.waypoints;
        if (!route || route.length < 2) return [];
        const measuredKm = routeDistanceKm(route);
        if (measuredKm < 0.2) return [];
        const totalKm = Math.max(0.1, measuredKm);
        const speed = Math.max(5, Number(dom.avgSpeed.value) || 20);
        const now = new Date();
        const fixedEta = state.weatherTimeMode === "fixed" ? weatherTimeAtOffset(state.weatherHourOffset) : null;
        const ratios = [];
        for (let percent = 0; percent <= 100; percent += 10) {
          ratios.push(percent / 100);
        }
        return ratios.map((ratio, index) => {
          const distanceKm = totalKm * ratio;
          const located = routePointAtDistance(route, distanceKm);
          return {
            label: index === 0 ? "Start" : index === ratios.length - 1 ? "Koniec" : Math.round(ratio * 100) + "% trasy",
            distanceKm,
            point: located.point,
            bearing: located.bearing,
            eta: fixedEta ? new Date(fixedEta.getTime()) : new Date(now.getTime() + (distanceKm / speed) * 3600000)
          };
        });
      }

      function formatWeatherHour(value) {
        const date = value instanceof Date ? value : new Date(value);
        if (Number.isNaN(date.getTime())) return "--:--";
        const two = (part) => String(part).padStart(2, "0");
        return two(date.getHours()) + ":" + two(date.getMinutes());
      }

      function weatherTimeAtOffset(offsetHours) {
        const offset = Math.max(0, Number(offsetHours) || 0);
        const date = new Date(Date.now() + offset * 3600000);
        date.setMinutes(0, 0, 0);
        return date;
      }

      function weatherTimeLabelText() {
        return formatWeatherHour(weatherTimeAtOffset(state.weatherHourOffset));
      }

      function syncWeatherTimeScale() {
        if (dom.weatherScaleNow) dom.weatherScaleNow.textContent = "dziś " + formatWeatherHour(weatherTimeAtOffset(0));
        if (dom.weatherScaleMid) dom.weatherScaleMid.textContent = "jutro " + formatWeatherHour(weatherTimeAtOffset(24));
        if (dom.weatherScaleEnd) dom.weatherScaleEnd.textContent = "pojutrze " + formatWeatherHour(weatherTimeAtOffset(48));
      }

      function syncWeatherTimeControls() {
        if (dom.weatherTimeMode && dom.weatherTimeMode.value !== state.weatherTimeMode) dom.weatherTimeMode.value = state.weatherTimeMode;
        if (dom.weatherTimeOffset && Number(dom.weatherTimeOffset.value) !== Number(state.weatherHourOffset || 0)) dom.weatherTimeOffset.value = String(state.weatherHourOffset || 0);
        syncWeatherTimeScale();
        if (dom.weatherTimeLabel) dom.weatherTimeLabel.textContent = state.weatherTimeMode === "fixed" ? weatherTimeLabelText() : "czas przejazdu";
        if (dom.weatherTimeOffset) dom.weatherTimeOffset.disabled = false;
        if (dom.weatherTimeControl) dom.weatherTimeControl.classList.toggle("fixed-mode", state.weatherTimeMode === "fixed");
        syncWeatherSliderButton();
      }

      function scheduleWeatherRefreshFromControls() {
        syncWeatherTimeControls();
        if (!state.routeLatLngs.length && state.waypoints.length < 2) return;
        if (state.weatherRefreshTimerId) window.clearTimeout(state.weatherRefreshTimerId);
        state.weatherRefreshTimerId = window.setTimeout(() => {
          state.weatherRefreshTimerId = null;
          loadRouteWeather();
        }, 550);
      }
      function weatherHazardInfo(item) {
        const weather = item && item.weather ? item.weather : {};
        const rain = Number(weather.rainChance || 0);
        const precipitation = Number(weather.precipitation || 0);
        const gust = Number(weather.windGust || weather.windSpeed || 0);
        const wind = Number(weather.windSpeed || 0);
        const temp = Number(weather.temperature);
        const windTone = item && item.wind ? item.wind.tone : "";
        let score = 0;
        const reasons = [];
        if (rain >= 60) { score += 42; reasons.push("☔ deszcz " + Math.round(rain) + "%"); }
        else if (rain >= 35) { score += 24; reasons.push("☔ możliwy deszcz " + Math.round(rain) + "%"); }
        if (precipitation >= 1) { score += 24; reasons.push("🌧 opad " + precipitation.toFixed(1) + " mm"); }
        else if (precipitation >= 0.2) { score += 10; reasons.push("🌧 lekki opad " + precipitation.toFixed(1) + " mm"); }
        if (gust >= 50) { score += 38; reasons.push("💨 porywy " + Math.round(gust) + " km/h"); }
        else if (gust >= 35) { score += 22; reasons.push("💨 wiatr/porywy " + Math.round(gust) + " km/h"); }
        else if (wind >= 25) { score += 10; reasons.push("💨 wiatr " + Math.round(wind) + " km/h"); }
        if (windTone === "bad") { score += 22; reasons.push("↘ wiatr w twarz"); }
        else if (windTone === "warn") { score += 8; reasons.push("↔ wiatr boczny"); }
        if (Number.isFinite(temp)) {
          if (temp <= 3) { score += 20; reasons.push("❄ zimno " + Math.round(temp) + "°C"); }
          else if (temp <= 8) { score += 9; reasons.push("🌡 chłodno " + Math.round(temp) + "°C"); }
          else if (temp >= 31) { score += 20; reasons.push("🔥 upał " + Math.round(temp) + "°C"); }
          else if (temp >= 27) { score += 10; reasons.push("🌡 gorąco " + Math.round(temp) + "°C"); }
        }
        const codeInfo = weatherCodeInfo(weather.code);
        let tone = "warn";
        if (score >= 70) tone = "bad";
        else if (score < 38) tone = "soft";
        return {
          score,
          tone,
          icon: score >= 70 ? "⚠" : codeInfo.icon,
          title: reasons[0] || codeInfo.text || "pogoda",
          reasons: reasons.length ? reasons : [codeInfo.icon + " " + codeInfo.text]
        };
      }

      function weatherMarkerDisplayMode() {
        const zoom = map && map.getZoom ? map.getZoom() : 13;
        if (zoom <= 9) return "temp-only";
        if (zoom <= 11) return "mini";
        return "full";
      }

      function weatherMarkerDimensions(mode) {
        if (mode === "temp-only") return { size: [44, 44], anchor: [22, 88], popup: [0, -66], tip: [0, -48] };
        if (mode === "mini") return { size: [96, 48], anchor: [48, 102], popup: [0, -82], tip: [0, -60] };
        return { size: [166, 68], anchor: [83, 126], popup: [0, -104], tip: [0, -78] };
      }

      function weatherMarkerMaxCount(mode) {
        const zoom = map && map.getZoom ? map.getZoom() : 13;
        if (mode === "temp-only") return zoom <= 8 ? 2 : 4;
        if (mode === "mini") return zoom <= 10 ? 5 : 7;
        return 12;
      }

      function weatherMarkerMinPixelGap(mode) {
        if (mode === "temp-only") return 92;
        if (mode === "mini") return 138;
        return 178;
      }

      function syncWeatherSliderButton() {
        if (dom.weatherTimeControl) dom.weatherTimeControl.classList.toggle("collapsed", !!state.weatherSliderCollapsed);
        if (!dom.weatherSliderToggleBtn) return;
        dom.weatherSliderToggleBtn.textContent = state.weatherSliderCollapsed ? "Pokaż suwak" : "Zwiń suwak";
        dom.weatherSliderToggleBtn.classList.toggle("off", !!state.weatherSliderCollapsed);
      }

      function toggleWeatherSlider() {
        state.weatherSliderCollapsed = !state.weatherSliderCollapsed;
        syncWeatherSliderButton();
        setStatus(state.weatherSliderCollapsed ? "Suwak pogody zwinięty." : "Suwak pogody pokazany.");
      }

      function syncWeatherRouteMarkersButton() {
        if (!dom.weatherRouteMarkersBtn) return;
        const hasItems = !!(state.weatherItems && state.weatherItems.length);
        dom.weatherRouteMarkersBtn.textContent = hasItems && state.weatherRouteMarkersVisible ? "Ukryj tablice mapy" : "Pokaż tablice mapy";
        dom.weatherRouteMarkersBtn.classList.toggle("off", !hasItems || !state.weatherRouteMarkersVisible);
      }

      function toggleWeatherRouteMarkers() {
        if (state.weatherRouteMarkersVisible) {
          state.weatherRouteMarkersVisible = false;
          weatherDetailLayer.clearLayers();
          syncWeatherRouteMarkersButton();
          setStatus("Tablice pogody na trasie ukryte.");
          return;
        }
        state.weatherRouteMarkersVisible = true;
        syncWeatherRouteMarkersButton();
        if (state.weatherItems && state.weatherItems.length) {
          drawWeatherDetails(state.weatherItems);
          setStatus("Tablice pogody na trasie przywrócone według aktualnego zoomu.");
        } else {
          setStatus("Brak zapisanej pogody. Pobieram pogodę trasy od nowa...");
          loadRouteWeather();
        }
      }

      function weatherDetailHtml(item, mode) {
        const weather = item && item.weather ? item.weather : {};
        const info = weatherCodeInfo(weather.code);
        const hazard = weatherHazardInfo(item);
        const temp = Number.isFinite(weather.temperature) ? Math.round(weather.temperature) + "°" : "--°";
        const rain = Number.isFinite(weather.rainChance) ? Math.round(weather.rainChance) + "%" : "--%";
        const wind = Number.isFinite(weather.windSpeed) ? Math.round(weather.windSpeed) : "--";
        const gust = Number.isFinite(weather.windGust) ? Math.round(weather.windGust) : "--";
        const windText = item && item.wind && item.wind.text ? item.wind.text : "wiatr";
        return [
          '<span class="weather-route-marker compact weather-route-card ' + escapeHtml(mode || "full") + ' ' + hazard.tone + '">',
          '<span class="weather-route-main"><em>' + escapeHtml(info.icon) + '</em><strong>' + escapeHtml(info.text) + '</strong></span>',
          '<span class="weather-route-meta">☔ ' + escapeHtml(rain) + ' • 💨 ' + escapeHtml(wind) + '/' + escapeHtml(gust) + ' km/h</span>',
          '<span class="weather-route-meta weather-route-wind-text">💨 z ' + escapeHtml(windCompassText(weather.windDirection)) + ': ' + escapeHtml(windText) + '</span>',
          '<span class="weather-route-temp-badge">' + escapeHtml(temp) + '</span>',
          '</span>'
        ].join("");
      }

      function selectWeatherMarkerItems(items, mode) {
        const list = (items || []).filter((item) => item && item.point && item.weather);
        if (!map || !map.latLngToLayerPoint || list.length <= 2) return list;
        const maxCount = weatherMarkerMaxCount(mode);
        const minGap = weatherMarkerMinPixelGap(mode);
        const lastIndex = list.length - 1;
        const ranked = list.map((item, index) => {
          const hazard = weatherHazardInfo(item).score || 0;
          const isEdge = index === 0 || index === lastIndex;
          const isQuarter = index % Math.max(1, Math.round(lastIndex / 4)) === 0;
          return { item, index, priority: (isEdge ? 10000 : 0) + hazard * 12 + (isQuarter ? 80 : 0) };
        }).sort((a, b) => b.priority - a.priority);
        const accepted = [];
        const placed = [];
        for (const entry of ranked) {
          if (accepted.length >= maxCount) break;
          const point = map.latLngToLayerPoint(entry.item.point);
          const tooClose = placed.some((placedPoint) => {
            const dx = placedPoint.x - point.x;
            const dy = placedPoint.y - point.y;
            return Math.sqrt(dx * dx + dy * dy) < minGap;
          });
          if (!tooClose || (entry.index === 0 && accepted.length === 0)) {
            accepted.push(entry);
            placed.push(point);
          }
        }
        return accepted.sort((a, b) => a.index - b.index).map((entry) => entry.item);
      }
      function drawWeatherDetails(items) {
        weatherDetailLayer.clearLayers();
        syncWeatherRouteMarkersButton();
        if (!state.weatherRouteMarkersVisible) return;
        const markerMode = weatherMarkerDisplayMode();
        const markerDims = weatherMarkerDimensions(markerMode);
        for (const item of selectWeatherMarkerItems(items, markerMode)) {
          if (!item || !item.point || !item.weather) continue;
          const weather = item.weather;
          const info = weatherCodeInfo(weather.code);
          const temperature = Number.isFinite(weather.temperature) ? Math.round(weather.temperature) + "°C" : "--°C";
          const rain = Number.isFinite(weather.rainChance) ? Math.round(weather.rainChance) + "%" : "--%";
          const precipitation = Number.isFinite(weather.precipitation) ? weather.precipitation.toFixed(1) + " mm" : "-- mm";
          const wind = Number.isFinite(weather.windSpeed) ? Math.round(weather.windSpeed) + " km/h" : "-- km/h";
          const gust = Number.isFinite(weather.windGust) ? Math.round(weather.windGust) + " km/h" : "-- km/h";
          const fromText = windCompassText(weather.windDirection);
          const icon = L.divIcon({
            className: "",
            html: weatherDetailHtml(item, markerMode),
            iconSize: markerDims.size,
            iconAnchor: markerDims.anchor,
            popupAnchor: markerDims.popup
          });
          const marker = L.marker(item.point, { icon, pane: "weatherPane", riseOnHover: true, zIndexOffset: 760 })
            .bindPopup([
              '<div class="dark-route-popup weather-hazard-popup">',
              '<strong>Pogoda na trasie • km ' + item.distanceKm.toFixed(1) + '</strong>',
              '<span>' + escapeHtml(item.label) + ' • ' + formatWeatherHour(item.eta) + '</span>',
              '<span>' + escapeHtml(info.icon + " " + info.text + " | temperatura " + temperature) + '</span>',
              '<span>' + escapeHtml("opady: " + rain + " / " + precipitation) + '</span>',
              '<span>' + escapeHtml("wiatr: " + wind + ", porywy " + gust + ", z " + fromText + " | " + (item.wind ? item.wind.text : "")) + '</span>',
              '<span>Tablica zmniejsza się automatycznie przy oddalaniu mapy.</span>',
              '</div>'
            ].join(""), { className: "dark-route-popup" })
            .addTo(weatherDetailLayer);
          marker.bindTooltip("km " + item.distanceKm.toFixed(1) + ": 🌡 " + temperature + " | ☔ " + rain + " | 💨 " + wind + " z " + fromText, {
            className: "route-hover-tip weather-hazard-tip",
            direction: "top",
            offset: markerDims.tip,
            opacity: 0.98
          });
        }
      }
      function drawWeatherHazards(items) {
        weatherHazardLayer.clearLayers();
        const candidates = (items || []).map((item) => ({ item, info: weatherHazardInfo(item) }))
          .filter((entry) => entry.item && entry.item.point && entry.info.score >= 22)
          .sort((a, b) => b.info.score - a.info.score);
        const selected = [];
        for (const entry of candidates) {
          const tooClose = selected.some((picked) => Math.abs((picked.item.distanceKm || 0) - (entry.item.distanceKm || 0)) < 5);
          if (tooClose && entry.info.score < 70) continue;
          selected.push(entry);
          if (selected.length >= 4) break;
        }
        if (!selected.length && candidates.length) selected.push(candidates[0]);
        selected.sort((a, b) => (a.item.distanceKm || 0) - (b.item.distanceKm || 0));
        for (const entry of selected) {
          const item = entry.item;
          const info = entry.info;
          const icon = L.divIcon({
            className: "",
            html: '<span class="weather-hazard-marker ' + info.tone + '"><em>' + info.icon + '</em><strong>POG</strong></span>',
            iconSize: [50, 30],
            iconAnchor: [25, -12],
            popupAnchor: [0, -16]
          });
          const marker = L.marker(item.point, { icon, pane: "weatherPane", riseOnHover: true, zIndexOffset: 980 })
            .bindPopup([
              '<div class="dark-route-popup weather-hazard-popup">',
              '<strong>Trudniejsza pogoda • km ' + item.distanceKm.toFixed(1) + '</strong>',
              '<span>' + escapeHtml(item.label) + ' • ' + formatWeatherHour(item.eta) + '</span>',
              '<span>' + escapeHtml(info.reasons.join(" | ")) + '</span>',
              '</div>'
            ].join(""), { className: "dark-route-popup" })
            .addTo(weatherHazardLayer);
          marker.bindTooltip("Pogoda km " + item.distanceKm.toFixed(1) + ": " + info.title + " | " + info.reasons.join(" | "), {
            className: "route-hover-tip weather-hazard-tip",
            direction: "top",
            offset: [0, -78],
            opacity: 0.98,
            sticky: true
          });
          marker.on("mouseover", () => marker.openTooltip());
          marker.on("mouseout", () => marker.closeTooltip());
          marker.on("click", () => marker.openPopup());
        }
      }
      function averageWeatherValue(items, getter) {
        const values = (items || []).map(getter).filter(Number.isFinite);
        if (!values.length) return NaN;
        return values.reduce((sum, value) => sum + value, 0) / values.length;
      }

      function windZoneRepresentative(items, centerRatio, totalKm) {
        if (!items || !items.length) return null;
        const targetKm = totalKm * centerRatio;
        return items.reduce((best, item) => {
          const delta = Math.abs((item.distanceKm || 0) - targetKm);
          return !best || delta < best.delta ? { item, delta } : best;
        }, null).item;
      }

      function loopDirectionText(points) {
        const route = (points || []).filter((point) => point && Number.isFinite(point.lat) && Number.isFinite(point.lng));
        if (route.length < 4) return "";
        let area = 0;
        for (let i = 0; i < route.length; i += 1) {
          const a = route[i];
          const b = route[(i + 1) % route.length];
          area += a.lng * b.lat - b.lng * a.lat;
        }
        if (Math.abs(area) < 0.000001) return "";
        return area < 0 ? "zgodnie z zegarem" : "przeciwnie do zegara";
      }

      function windRouteCenter(items) {
        const route = state.routeLatLngs && state.routeLatLngs.length >= 2 ? state.routeLatLngs : (items || []).map((item) => item.point);
        const valid = (route || []).filter((point) => point && Number.isFinite(point.lat) && Number.isFinite(point.lng));
        if (!valid.length) return null;
        const bounds = L.latLngBounds(valid);
        return bounds.getCenter();
      }

      function windSpatialSide(item, center) {
        if (!item || !item.point || !center) return "top";
        const northSouth = item.point.lat - center.lat;
        const eastWest = item.point.lng - center.lng;
        if (Math.abs(northSouth) >= Math.abs(eastWest)) return northSouth >= 0 ? "top" : "bottom";
        return eastWest >= 0 ? "right" : "left";
      }

      function windSideScore(item, side, center) {
        if (!item || !item.point || !center) return -Infinity;
        if (side === "top") return item.point.lat - center.lat;
        if (side === "bottom") return center.lat - item.point.lat;
        if (side === "right") return item.point.lng - center.lng;
        return center.lng - item.point.lng;
      }

      function windRepresentativeBySide(items, side, center) {
        if (!items || !items.length) return null;
        const sorted = items.slice().sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
        if (sorted.length) return sorted[Math.floor(sorted.length / 2)];
        return (items || []).reduce((best, item) => {
          const score = windSideScore(item, side, center);
          return !best || score > best.score ? { item, score } : best;
        }, null).item;
      }

      function windSideColor(side) {
        if (side === "top") return "#ff47b9";
        if (side === "right") return "#4de8ff";
        if (side === "bottom") return "#ffd36e";
        return "#a76cff";
      }

      function drawWindZoneHighlights(center) {
        if (typeof windQuarterLayer === "undefined") return;
        windQuarterLayer.clearLayers();
        const route = state.routeLatLngs && state.routeLatLngs.length >= 2 ? state.routeLatLngs : [];
        if (!route.length || !center) return;
        const samples = route.length > 1000 ? sampleRoute(route, 1000) : route;
        for (let i = 1; i < samples.length; i += 1) {
          const a = samples[i - 1];
          const b = samples[i];
          if (!a || !b) continue;
          const mid = L.latLng((a.lat + b.lat) / 2, (a.lng + b.lng) / 2);
          const side = windSpatialSide({ point: mid }, center);
          L.polyline([a, b], {
            pane: "windPane",
            color: windSideColor(side),
            weight: 12,
            opacity: 0.3,
            lineCap: "round",
            lineJoin: "round",
            interactive: false
          }).addTo(windQuarterLayer);
        }
      }

      function renderWindZones(items) {
        if (typeof windQuarterLayer !== "undefined") windQuarterLayer.clearLayers();
        if (!dom.windZonePanel) return;
        dom.windZonePanel.classList.add("hidden");
        dom.windZonePanel.innerHTML = "";
      }
      function renderWeatherCards(items) {
        const maxRain = Math.max(...items.map((item) => item.weather.rainChance || 0));
        const maxGust = Math.max(...items.map((item) => item.weather.windGust || item.weather.windSpeed || 0));
        const maxWind = Math.max(...items.map((item) => item.weather.windSpeed || 0));
        const headwindCount = items.filter((item) => item.wind.tone === "bad").length;
        const sideWindCount = items.filter((item) => item.wind.tone === "warn").length;
        const temps = items.map((item) => item.weather.temperature).filter(Number.isFinite);
        const tempText = temps.length ? Math.round(Math.min(...temps)) + "–" + Math.round(Math.max(...temps)) + "°C" : "--°C";
        const warnings = [];
        if (maxRain >= 55) warnings.push("wysokie ryzyko deszczu");
        else if (maxRain >= 30) warnings.push("możliwy deszcz");
        if (maxGust >= 45) warnings.push("mocne porywy");
        if (headwindCount >= 2) warnings.push("sporo wiatru w twarz");
        const mainWeather = items.reduce((best, item) => {
          const codeInfo = weatherCodeInfo(item.weather.code);
          const score = (item.weather.rainChance || 0) + (item.weather.precipitation || 0) * 30 + (item.weather.windGust || 0) * 0.35;
          return !best || score > best.score ? { icon: codeInfo.icon, score } : best;
        }, null);
        const weatherIcon = mainWeather ? mainWeather.icon : "☁";
        const timeModeText = state.weatherTimeMode === "fixed" ? "Wybrana godzina: " + weatherTimeLabelText() + ". " : "Czas przejazdu według średniej. ";
        dom.weatherSummary.textContent = weatherIcon + " " + timeModeText + "🌡 Temperatura " + tempText + ", ☔ max deszcz " + Math.round(maxRain) + "%, 💨 porywy do " + Math.round(maxGust) + " km/h" + (warnings.length ? ". Uwaga: " + warnings.join(", ") + "." : ". Warunki wyglądają spokojnie.");
        state.weatherItems = items;
        drawWeatherDetails(items);
        drawWeatherHazards(items);
        renderWindZones(items);
        if (dom.weatherWidgetMain) {
          dom.weatherWidgetMain.textContent = weatherIcon + " 🌡 " + tempText + " | ☔ " + Math.round(maxRain) + "%";
          dom.weatherWidgetSub.textContent = "💨 wiatr " + Math.round(maxWind) + "/" + Math.round(maxGust) + " km/h" + (headwindCount ? " | w twarz " + headwindCount + "x" : sideWindCount ? " | boczny " + sideWindCount + "x" : "");
        }
        dom.weatherGrid.innerHTML = items.map((item) => {
          const info = weatherCodeInfo(item.weather.code);
          const temperature = Number.isFinite(item.weather.temperature) ? Math.round(item.weather.temperature) + "°C" : "--°C";
          const rain = Number.isFinite(item.weather.rainChance) ? Math.round(item.weather.rainChance) + "%" : "--%";
          const wind = Number.isFinite(item.weather.windSpeed) ? Math.round(item.weather.windSpeed) + " km/h" : "-- km/h";
          const gust = Number.isFinite(item.weather.windGust) ? Math.round(item.weather.windGust) + " km/h" : "-- km/h";
          const precipitation = Number.isFinite(item.weather.precipitation) ? item.weather.precipitation.toFixed(1) + " mm" : "-- mm";
          return [
            '<article class="weather-card">',
            '<div class="weather-icon">' + info.icon + "</div>",
            '<div class="weather-main">',
            '<div class="weather-title"><span>' + item.label + " • " + item.distanceKm.toFixed(1) + ' km</span><span>' + formatWeatherHour(item.eta) + "</span></div>",
            '<div class="weather-details">' + info.icon + " " + info.text + " | 🌡 " + temperature + " | ☔ " + rain + " / " + precipitation + "<br>💨 " + wind + ", porywy " + gust + " | " + item.wind.text + "</div>",
            "</div>",
            "</article>"
          ].join("");
        }).join("");
      }

      async function fetchWeatherPoint(params) {
        const url = "https://api.open-meteo.com/v1/forecast?" + params.toString();
        try {
          return await fetchJson(url, 15000);
        } catch (error) {
          if (String(error.message || "").includes("429")) {
            await new Promise((resolve) => window.setTimeout(resolve, 2200));
            return await fetchJson(url, 18000);
          }
          throw error;
        }
      }

      function metNoWeatherFromTimeseries(data, eta) {
        const series = data && data.properties && Array.isArray(data.properties.timeseries) ? data.properties.timeseries : [];
        if (!series.length) return null;
        let best = series[0];
        let bestDelta = Infinity;
        for (const item of series) {
          const delta = Math.abs(new Date(item.time).getTime() - eta.getTime());
          if (delta < bestDelta) {
            bestDelta = delta;
            best = item;
          }
        }
        const instant = best.data && best.data.instant && best.data.instant.details ? best.data.instant.details : {};
        const next = best.data && (best.data.next_1_hours || best.data.next_6_hours || best.data.next_12_hours);
        const nextDetails = next && next.details ? next.details : {};
        const summary = next && next.summary ? next.summary.symbol_code : "forecast";
        const precipitation = Number(nextDetails.precipitation_amount || 0);
        const windSpeed = Number(instant.wind_speed || 0) * 3.6;
        const windGust = Number(instant.wind_speed_of_gust || instant.wind_speed || 0) * 3.6;
        return {
          time: best.time,
          temperature: Number(instant.air_temperature),
          rainChance: precipitation > 0.2 ? 60 : precipitation > 0 ? 35 : 8,
          precipitation,
          windSpeed,
          windGust,
          windDirection: Number(instant.wind_from_direction || 0),
          code: summary
        };
      }

      async function fetchWeatherForSample(sample) {
        const params = new URLSearchParams({
          latitude: sample.point.lat.toFixed(5),
          longitude: sample.point.lng.toFixed(5),
          hourly: "temperature_2m,precipitation_probability,precipitation,wind_speed_10m,wind_gusts_10m,wind_direction_10m,weather_code",
          forecast_days: "3",
          timezone: "auto",
          wind_speed_unit: "kmh"
        });
        try {
          const data = await fetchWeatherPoint(params);
          const weather = nearestHourlyWeather(data.hourly, sample.eta);
          if (!weather) throw new Error("Brak danych godzinowych z Open-Meteo.");
          return weather;
        } catch (openMeteoError) {
          const url = "https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=" + encodeURIComponent(sample.point.lat.toFixed(5)) + "&lon=" + encodeURIComponent(sample.point.lng.toFixed(5));
          const data = await fetchJsonRetry(url, 16000, 1, 1500);
          const weather = metNoWeatherFromTimeseries(data, sample.eta);
          if (!weather) throw openMeteoError;
          return weather;
        }
      }

      async function fetchWeatherForSamples(samples) {
        const params = new URLSearchParams({
          latitude: samples.map((sample) => sample.point.lat.toFixed(5)).join(","),
          longitude: samples.map((sample) => sample.point.lng.toFixed(5)).join(","),
          hourly: "temperature_2m,precipitation_probability,precipitation,wind_speed_10m,wind_gusts_10m,wind_direction_10m,weather_code",
          forecast_days: "3",
          timezone: "auto",
          wind_speed_unit: "kmh"
        });
        const data = await fetchWeatherPoint(params);
        const locations = normalizeWeatherLocations(data);
        if (!locations.length) throw new Error("Brak danych pogodowych dla trasy.");
        return samples.map((sample, index) => {
          const location = locations[Math.min(index, locations.length - 1)];
          const weather = nearestHourlyWeather(location && location.hourly, sample.eta);
          if (!weather) throw new Error("Brak danych godzinowych z Open-Meteo dla punktu " + sample.label + ".");
          return weather;
        });
      }

      function setLegendCollapsed(collapsed) {
        if (!dom.mapLegend) return;
        const isCollapsed = !!collapsed;
        dom.mapLegend.classList.toggle("collapsed", isCollapsed);
        dom.mapLegend.setAttribute("aria-expanded", isCollapsed ? "false" : "true");
        if (dom.legendToggleBtn) {
          dom.legendToggleBtn.textContent = isCollapsed ? "+" : "−";
          dom.legendToggleBtn.setAttribute("aria-label", isCollapsed ? "Rozwiń legendę" : "Zwiń legendę");
        }
        try {
          localStorage.setItem("planerLegendCollapsed", isCollapsed ? "1" : "0");
        } catch (error) {}
      }

      function restoreLegendState() {
        let saved = "0";
        try {
          saved = localStorage.getItem("planerLegendCollapsed") || "0";
        } catch (error) {}
        setLegendCollapsed(saved === "1");
      }

      function toggleLegendCollapsed() {
        if (!dom.mapLegend) return;
        setLegendCollapsed(!dom.mapLegend.classList.contains("collapsed"));
      }
      function openWeatherPanel() {
        if (dom.weatherWidget) dom.weatherWidget.classList.remove("hidden");
        if (dom.weatherPanel) dom.weatherPanel.classList.add("visible");
      }

      function closeWeatherPanel() {
        if (dom.weatherPanel) dom.weatherPanel.classList.remove("visible");
      }
      async function loadRouteWeather() {
        openWeatherPanel();
        const samples = weatherRouteSamples();
        if (samples.length < 2) {
          dom.weatherSummary.textContent = "Najpierw wyznacz trasę albo dodaj punkty własnej trasy. Potem kliknij Pogoda trasy.";
          dom.weatherGrid.innerHTML = "";
          renderWindZones([]);
          setStatus("Najpierw wyznacz trasę albo dodaj punkty własnej trasy.", "warn");
          return;
        }
        const requestId = ++state.weatherRequestId;
        dom.weatherSummary.textContent = "Pobieram prognozę dla punktów na trasie...";
        dom.weatherGrid.innerHTML = "";
        weatherHazardLayer.clearLayers();
        weatherDetailLayer.clearLayers();
        renderWindZones([]);
        if (dom.weatherWidgetMain) {
          dom.weatherWidgetMain.textContent = "pobieram...";
          dom.weatherWidgetSub.textContent = "prognoza co 10% trasy";
        }
        const cacheKey = weatherCacheKey(samples);
        if (state.weatherItems.length && state.weatherCacheKey === cacheKey && Date.now() - state.weatherCacheAt < 10 * 60 * 1000) {
          renderWeatherCards(state.weatherItems);
          setStatus("Pogoda trasy pokazana z pamięci. Kliknij ponownie później, żeby odświeżyć.");
          return;
        }
        setStatus("Pobieram pogodę trasy z Open-Meteo co 10% trasy...");
        try {
          let weatherList = [];
          try {
            dom.weatherSummary.textContent = "Pobieram prognozę grupowo: " + samples.length + " punktów co 10% trasy...";
            weatherList = await fetchWeatherForSamples(samples);
          } catch (batchError) {
            weatherList = [];
            for (let index = 0; index < samples.length; index += 1) {
              const sample = samples[index];
              dom.weatherSummary.textContent = "Pobieram prognozę awaryjnie: punkt " + (index + 1) + "/" + samples.length + " (" + sample.label + ")...";
              weatherList.push(await fetchWeatherForSample(sample));
              if (index < samples.length - 1) {
                await new Promise((resolve) => window.setTimeout(resolve, 280));
              }
            }
          }
          const items = samples.map((sample, index) => {
            const weather = weatherList[index];
            return {
              ...sample,
              weather,
              wind: windRideInfo(weather.windDirection, sample.bearing)
            };
          });
          if (requestId !== state.weatherRequestId) return;
          state.weatherCacheKey = cacheKey;
          state.weatherCacheAt = Date.now();
          renderWeatherCards(items);
          setStatus("Pogoda trasy gotowa: prognoza co 10% trasy. Sprawdź panel na mapie.");
        } catch (error) {
          if (requestId !== state.weatherRequestId) return;
          if (String(error.message || "").includes("429") && state.weatherItems.length) {
            renderWeatherCards(state.weatherItems);
            dom.weatherSummary.textContent += " Dane pokazane z ostatniego udanego pobrania, bo Open-Meteo chwilowo ograniczyło zapytania.";
            setStatus("Open-Meteo zwróciło HTTP 429. Pokazuję ostatnią pogodę z pamięci; odczekaj chwilę przed kolejnym odświeżeniem.", "warn");
            return;
          }
          state.weatherItems = [];
          weatherHazardLayer.clearLayers();
          weatherDetailLayer.clearLayers();
          dom.weatherSummary.textContent = String(error.message || "").includes("429")
            ? "Open-Meteo chwilowo ograniczyło zapytania (HTTP 429). Odczekaj minutę i kliknij Pogoda trasy ponownie."
            : "Nie udało się pobrać pogody: " + error.message;
          if (dom.weatherWidgetMain) {
            dom.weatherWidgetMain.textContent = "brak pogody";
            dom.weatherWidgetSub.textContent = String(error.message || "").includes("429") ? "limit API, odczekaj" : "spróbuj ponownie";
          }
          setStatus("Nie udało się pobrać pogody: " + error.message, "bad");
        }
      }

      function routePresetTuning() {
        const preset = dom.routePreset.value;
        if (preset === "road") {
          return {
            shape: "road",
            variantOffset: 41,
            pointBonus: 0,
            areaPointBonus: -2,
            minPoints: 4,
            maxPoints: 5,
            minAreaPoints: 4,
            maxAreaPoints: 6,
            areaReach: 0.78,
            areaRoadFactor: 2.35,
            roadFactors: [2.05, 2.28, 1.9, 2.45, 1.78, 2.18],
            sizeVariants: [0.82, 0.72, 0.9, 0.64, 0.98, 0.58, 0.76, 1.04],
            scaleVariants: [0.68, 0.78, 0.58, 0.86, 0.5, 0.94, 0.46, 0.74, 0.62, 0.82],
            ovalX: [2.1, 1.86, 2.34, 1.72, 2.22, 1.98],
            ovalY: [0.5, 0.62, 0.44, 0.68, 0.54, 0.58],
            angleStep: 31,
            rotationShift: 18,
            lobeStrength: 0.04
          };
        }
        if (preset === "adventure") {
          return {
            shape: "adventure",
            variantOffset: 73,
            pointBonus: 1,
            areaPointBonus: 2,
            minPoints: 7,
            maxPoints: 9,
            minAreaPoints: 7,
            maxAreaPoints: 10,
            areaReach: 1.08,
            areaRoadFactor: 1.08,
            roadFactors: [0.92, 1.04, 0.82, 1.16, 0.74, 1.28],
            sizeVariants: [1.12, 1.28, 1, 1.42, 0.92, 1.5, 1.08, 1.6],
            scaleVariants: [1.08, 1.22, 0.96, 1.36, 0.86, 1.5, 0.78, 1.64, 0.92, 1.18],
            ovalX: [1.04, 1.42, 0.74, 1.28, 0.82, 1.56],
            ovalY: [0.82, 0.62, 1.24, 0.76, 1.16, 0.68],
            angleStep: 47,
            rotationShift: 64,
            lobeStrength: 0.34
          };
        }
        if (preset === "scenic") {
          return {
            shape: "scenic",
            variantOffset: 29,
            pointBonus: 1,
            areaPointBonus: 1,
            minPoints: 6,
            maxPoints: 8,
            minAreaPoints: 6,
            maxAreaPoints: 9,
            areaReach: 1.02,
            areaRoadFactor: 1.38,
            roadFactors: [1.12, 1.26, 1.02, 1.36, 0.96, 1.44],
            sizeVariants: [0.98, 1.12, 0.88, 1.22, 0.82, 1.32, 1.04, 1.42],
            scaleVariants: [0.98, 1.1, 0.9, 1.24, 0.82, 1.34, 0.76, 1.44, 0.92, 1.18],
            ovalX: [1.18, 0.92, 1.34, 1.02, 1.26, 0.86],
            ovalY: [0.78, 1.04, 0.72, 1.12, 0.86, 0.98],
            angleStep: 37,
            rotationShift: 36,
            lobeStrength: 0.2
          };
        }
        return {
          shape: "balanced",
          variantOffset: 0,
          pointBonus: 0,
          areaPointBonus: 0,
          minPoints: 5,
          maxPoints: 7,
          minAreaPoints: 5,
          maxAreaPoints: 8,
          areaReach: 0.97,
          areaRoadFactor: 1.55,
          roadFactors: [1.32, 1.42, 1.22, 1.55, 1.18, 1.48],
          sizeVariants: [0.92, 0.82, 1, 0.74, 1.08, 0.68, 0.88, 1.14],
          scaleVariants: [0.96, 0.84, 1.08, 0.72, 1.18, 0.62, 0.52, 1.28, 0.44, 1],
          ovalX: [1, 1.22, 0.82, 1.08, 0.94, 1.14],
          ovalY: [0.92, 0.78, 1.08, 0.88, 1.02, 0.82],
          angleStep: 19,
          rotationShift: 0,
          lobeStrength: 0.12
        };
      }

      function routeExtentStats(points) {
        if (!points || points.length < 2) {
          return { width: 0, height: 0, major: 0, minor: 0, aspect: 1 };
        }
        let minX = Infinity;
        let maxX = -Infinity;
        let minY = Infinity;
        let maxY = -Infinity;
        for (const point of sampleRoute(points, Math.min(90, points.length))) {
          const xy = latLngToXy(point, state.start);
          minX = Math.min(minX, xy.x);
          maxX = Math.max(maxX, xy.x);
          minY = Math.min(minY, xy.y);
          maxY = Math.max(maxY, xy.y);
        }
        const width = Math.max(0.01, maxX - minX);
        const height = Math.max(0.01, maxY - minY);
        const major = Math.max(width, height);
        const minor = Math.max(0.01, Math.min(width, height));
        return {
          width,
          height,
          major,
          minor,
          aspect: major / minor
        };
      }

      function distancePointToRouteKm(point, route) {
        if (!route || route.length < 2) return Infinity;
        let best = Infinity;
        const step = Math.max(1, Math.floor(route.length / 160));
        for (let i = step; i < route.length; i += step) {
          best = Math.min(best, distancePointToSegmentKm(point, route[i - step], route[i]));
          if (best < 0.12) break;
        }
        return best;
      }

      function routeSimilarityKm(routeA, routeB) {
        if (!routeA || !routeB || routeA.length < 2 || routeB.length < 2) return Infinity;
        const samples = sampleRoute(routeA, Math.min(18, routeA.length));
        let sum = 0;
        for (const point of samples) {
          sum += distancePointToRouteKm(point, routeB);
        }
        return sum / Math.max(1, samples.length);
      }

      function presetShapePenalty(routeLatLngs, targetKm) {
        const tuning = routePresetTuning();
        const extent = routeExtentStats(routeLatLngs);
        let penalty = 0;
        if (tuning.shape === "road") {
          penalty += Math.max(0, 1.85 - extent.aspect) * 1900;
          penalty += Math.max(0, targetKm * 0.13 - extent.major) * 80;
        } else if (tuning.shape === "adventure") {
          penalty += Math.max(0, 1.2 - extent.aspect) * 800;
          penalty -= Math.min(900, extent.aspect * 110 + extent.major * 12);
        } else {
          penalty += Math.max(0, extent.aspect - 2.6) * 520;
        }

        const referenceRoute = state.avoidPreviousRoute && state.previousRouteLatLngs.length >= 8
          ? state.previousRouteLatLngs
          : (state.routeLatLngs.length >= 8 ? state.routeLatLngs : []);
        if (referenceRoute.length >= 8) {
          const similarity = routeSimilarityKm(routeLatLngs, referenceRoute);
          const threshold = Math.max(1.6, targetKm * 0.025);
          if (similarity < threshold) {
            penalty += (threshold - similarity) * 4200;
          }
        }
        return penalty;
      }

      function candidateScore(result, targetKm, maxRadiusKm) {
        return scoreStats(result.stats, targetKm, maxRadiusKm)
          + presetShapePenalty(result.routed.latlngs, targetKm);
      }

      function choiceRouteLatLngs(choice) {
        return choice && choice.result && choice.result.routed
          ? choice.result.routed.latlngs || []
          : [];
      }

      function choicesTooSimilar(choiceA, choiceB, targetKm) {
        const routeA = choiceRouteLatLngs(choiceA);
        const routeB = choiceRouteLatLngs(choiceB);
        if (routeA.length < 2 || routeB.length < 2) return false;
        const similarity = Math.min(routeSimilarityKm(routeA, routeB), routeSimilarityKm(routeB, routeA));
        const threshold = clamp(targetKm * 0.018, 0.55, 2.2);
        return similarity < threshold;
      }

      function pickBestVariants(items, limit, targetKm) {
        const sorted = items
          .filter((item) => item && item.result && item.result.routed && item.result.routed.latlngs.length >= 2)
          .sort((a, b) => a.score - b.score);
        const picked = [];
        for (const item of sorted) {
          if (picked.length >= limit) break;
          if (!picked.some((selected) => choicesTooSimilar(item, selected, targetKm))) {
            picked.push(item);
          }
        }
        for (const item of sorted) {
          if (picked.length >= limit) break;
          if (!picked.includes(item)) picked.push(item);
        }
        return picked;
      }

      function scaleCandidate(points, factor, origin) {
        const frame = state.areaPoints.length >= 3 ? areaFrame(origin) : null;
        return points.map((point, index) => {
          if (index === 0 || index === points.length - 1) return state.start;
          const xy = latLngToXy(point, origin);
          const x = frame ? clamp(xy.x * factor, frame.minX, frame.maxX) : xy.x * factor;
          const y = frame ? clamp(xy.y * factor, frame.minY, frame.maxY) : xy.y * factor;
          return xyToLatLng(x, y, origin);
        });
      }

      function lockedWaypointPoints() {
        return Array.from(state.lockedWaypoints)
          .sort((a, b) => a - b)
          .map((index) => state.waypoints[index])
          .filter(Boolean);
      }

      function withLockedWaypoints(points) {
        const locked = lockedWaypointPoints();
        if (!locked.length) return points;
        return [state.start, ...locked, ...points.slice(1, -1), state.start];
      }

      function makeAreaLoopCandidate(targetKm, maxRadiusKm, variant) {
        const center = areaCentroid();
        const frame = areaFrame(center);
        const width = frame.maxX - frame.minX;
        const height = frame.maxY - frame.minY;
        const tuning = routePresetTuning();
        const presetVariant = variant + tuning.variantOffset + state.routeSearchNonce * (tuning.shape === "road" ? 17 : tuning.shape === "adventure" ? 31 : 11);
        const baseCount = targetKm > 145 ? 8 : targetKm > 95 ? 7 : targetKm > 45 ? 6 : 5;
        const count = clamp(baseCount + tuning.areaPointBonus, tuning.minAreaPoints, tuning.maxAreaPoints);
        const reach = [0.98, 0.94, 1, 0.9, 0.86, 0.76][presetVariant % 6] * tuning.areaReach;
        const power = [0.48, 0.42, 0.55, 0.36][presetVariant % 4];
        const offset = ((presetVariant % count) / count) * Math.PI * 0.9 + toRad(presetVariant * 3 + tuning.rotationShift);
        const scaleVariants = tuning.scaleVariants;

        const buildPoints = (scaleX, scaleY) => {
          const rx = Math.max(0.7, width * 0.5 * reach * scaleX);
          const ry = Math.max(0.7, height * 0.5 * reach * scaleY);
          const points = [state.start];

          for (let i = 0; i < count; i += 1) {
            const angle = (i / count) * Math.PI * 2 + offset;
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            const lobe = tuning.shape === "adventure"
              ? 1 + Math.sin(angle * 3 + presetVariant) * tuning.lobeStrength
              : 1;
            const roadSmoothing = tuning.shape === "road" ? (i % 2 === 0 ? 1 : 0.78) : 1;
            const x = frame.centerX + Math.sign(cos) * rx * Math.pow(Math.abs(cos), power) * lobe;
            const y = frame.centerY + Math.sign(sin) * ry * Math.pow(Math.abs(sin), power) * lobe * roadSmoothing;
            const candidate = xyToLatLng(clamp(x, frame.minX, frame.maxX), clamp(y, frame.minY, frame.maxY), center);
            points.push(candidate);
          }

          points.push(state.start);
          return points;
        };

        const fullPoints = buildPoints(1, 1);
        const fullDistance = waypointDistanceKm(fullPoints);
        const roadFactor = tuning.areaRoadFactor;
        const targetScale = clamp(targetKm / Math.max(1, fullDistance * roadFactor), 0.12, 1);
        const variantScale = scaleVariants[presetVariant % scaleVariants.length];
        let scaleX = clamp(targetScale * variantScale, 0.12, 1);
        let scaleY = scaleX;
        if (targetScale < 0.78 && Math.max(width, height) / Math.max(0.1, Math.min(width, height)) > 1.25) {
          const majorScale = clamp((0.68 + targetScale * 0.32) * variantScale, 0.48, 1);
          const minorScale = clamp((targetScale ** 1.45) * variantScale, 0.14, 1);
          if (height > width) {
            scaleY = majorScale;
            scaleX = minorScale;
          } else {
            scaleX = majorScale;
            scaleY = minorScale;
          }
        }
        return withLockedWaypoints(buildPoints(scaleX, scaleY));
      }

      function makeLoopCandidate(targetKm, maxRadiusKm, variant) {
        if (state.areaPoints.length >= 3) {
          return makeAreaLoopCandidate(targetKm, maxRadiusKm, variant);
        }
        const tuning = routePresetTuning();
        const presetVariant = variant + tuning.variantOffset + state.routeSearchNonce * (tuning.shape === "road" ? 17 : tuning.shape === "adventure" ? 31 : 11);
        let baseCount = targetKm > 70 ? 6 : 5;
        if (tuning.shape === "road") {
          baseCount = targetKm > 135 ? 5 : 4;
        } else if (tuning.shape === "adventure") {
          baseCount = targetKm > 135 ? 9 : targetKm > 70 ? 8 : 7;
        }
        const count = clamp(baseCount + (presetVariant % 3 === 0 ? tuning.pointBonus : 0), tuning.minPoints, tuning.maxPoints);
        const roadFactors = tuning.roadFactors;
        const sizeVariants = tuning.sizeVariants;
        const baseRadius = clamp(targetKm / (2 * Math.PI * roadFactors[presetVariant % roadFactors.length]) * sizeVariants[presetVariant % sizeVariants.length], maxRadiusKm * 0.18, maxRadiusKm * 0.82);
        const rotations = [0, 28, 55, 83, 112, 145, 178, 212, 246, 280, 315, 340];
        const rotation = rotations[presetVariant % rotations.length] + tuning.rotationShift;
        const ovalX = tuning.ovalX[presetVariant % tuning.ovalX.length];
        const ovalY = tuning.ovalY[presetVariant % tuning.ovalY.length];
        const points = [state.start];

        for (let i = 0; i < count; i += 1) {
          const angle = (i / count) * Math.PI * 2 + toRad((presetVariant * tuning.angleStep) % 360);
          const radius = clamp(baseRadius, maxRadiusKm * 0.24, maxRadiusKm * 0.9);
          const lobe = tuning.shape === "adventure"
            ? 1 + (i % 2 === 0 ? tuning.lobeStrength : -tuning.lobeStrength * 0.72)
            : 1 + Math.sin(angle * 2) * tuning.lobeStrength;
          const raw = {
            x: Math.cos(angle) * radius * ovalX * lobe,
            y: Math.sin(angle) * radius * ovalY * lobe
          };
          const rawRadius = Math.hypot(raw.x, raw.y);
          if (rawRadius > maxRadiusKm * 0.94) {
            raw.x *= (maxRadiusKm * 0.94) / rawRadius;
            raw.y *= (maxRadiusKm * 0.94) / rawRadius;
          }
          const rotated = rotatePoint(raw, rotation);
          points.push(xyToLatLng(rotated.x, rotated.y, state.start));
        }

        points.push(state.start);
        return withLockedWaypoints(points);
      }

      async function routeCandidateWithDistanceFit(candidate, targetKm, maxRadiusKm) {
        const first = await routeAndMeasure(candidate, { analyzeOsm: false });
        let best = {
          candidate,
          result: first,
          score: candidateScore(first, targetKm, maxRadiusKm)
        };
        const errorKm = first.stats.distanceKm - targetKm;
        const correctionLimit = Math.max(6, targetKm * 0.1);
        if (Math.abs(errorKm) <= correctionLimit) return best;

        const origin = state.areaPoints.length >= 3 ? areaCentroid() : state.start;
        const factor = clamp(Math.sqrt(targetKm / Math.max(first.stats.distanceKm, 1)), 0.62, 1.28);
        const adjusted = scaleCandidate(candidate, factor, origin);
        try {
          const second = await routeAndMeasure(adjusted, { analyzeOsm: false });
          const secondScore = candidateScore(second, targetKm, maxRadiusKm);
          const secondError = Math.abs(second.stats.distanceKm - targetKm);
          const firstError = Math.abs(first.stats.distanceKm - targetKm);
          if (secondScore < best.score || secondError + 2 < firstError) {
            best = {
              candidate: adjusted,
              result: second,
              score: secondScore
            };
          }
        } catch (error) {
          // If the correction fails, keep the original candidate. OSRM can reject
          // aggressive geometry in sparse areas.
        }
        return best;
      }

      function variantSummary(choice, index, targetKm) {
        const stats = choice.result.stats;
        const delta = stats.distanceKm - targetKm;
        const quality = [];
        quality.push(stats.distanceKm.toFixed(1) + " km");
        quality.push("różn. " + (delta >= 0 ? "+" : "") + delta.toFixed(1) + " km");
        quality.push("las " + (stats.forestKm || 0).toFixed(1) + " km");
        if ((stats.forestUnpavedKm || 0) > 0.05) quality.push("las+grunt " + stats.forestUnpavedKm.toFixed(1) + " km");
        if ((stats.unpavedKm || 0) > 0.05) quality.push("grunt " + stats.unpavedKm.toFixed(1) + " km");
        quality.push("drogi " + Math.round(stats.roadRiskPercent || 0) + "%");
        quality.push("max " + (stats.maxGrade || 0).toFixed(1) + "%");
        return {
          title: "Wariant " + (index + 1),
          body: quality.join(" | ")
        };
      }

      function renderVariantPanel(targetKm) {
        dom.variantList.innerHTML = "";
        if (!state.variantChoices.length) {
          dom.variantPanel.classList.remove("visible");
          dom.showVariantsBtn.classList.remove("visible");
          if (dom.variantTitle) dom.variantTitle.textContent = "Najlepsze warianty";
          return;
        }
        if (dom.variantTitle) dom.variantTitle.textContent = "Najlepsze warianty (" + state.variantChoices.length + ")";
        state.variantChoices.forEach((choice, index) => {
          const summary = variantSummary(choice, index, targetKm);
          const card = document.createElement("article");
          card.className = "variant-card";
          const title = document.createElement("strong");
          title.textContent = summary.title;
          const body = document.createElement("span");
          body.textContent = summary.body;
          const button = document.createElement("button");
          button.className = "button";
          button.type = "button";
          button.textContent = index === state.activeVariantIndex ? "Wczytany" : "Wczytaj";
          button.addEventListener("click", () => applyVariantChoice(index, true));
          card.appendChild(title);
          card.appendChild(body);
          card.appendChild(button);
          dom.variantList.appendChild(card);
        });
        dom.variantPanel.classList.add("visible");
        dom.showVariantsBtn.classList.remove("visible");
      }

      function hideVariantPanel() {
        dom.variantPanel.classList.remove("visible");
        if (state.variantChoices.length) {
          dom.showVariantsBtn.classList.add("visible");
        }
      }

      function showVariantPanel() {
        if (!state.variantChoices.length) {
          setStatus("Nie ma jeszcze wariantów. Najpierw kliknij Szukaj płaskiej pętli.", "warn");
          return;
        }
        dom.showVariantsBtn.classList.remove("visible");
        dom.variantPanel.classList.add("visible");
      }

      function applyVariantChoice(index, fit) {
        const choice = state.variantChoices[index];
        if (!choice) return;
        state.mode = isPointMode() ? "point" : "loop";
        state.activeVariantIndex = index;
        state.waypoints = choice.candidate;
        if (isPointMode() && choice.candidate.length >= 2) {
          state.finish = choice.candidate[choice.candidate.length - 1];
        }
        normalizeLockedWaypoints();
        state.activeRoutePreset = dom.routePreset.value;
        state.avoidPreviousRoute = false;
        redrawMarkers();
        drawGuide(choice.candidate, false);
        setRoute(choice.result.routed.latlngs, choice.result.stats, "OSRM bike");
        if (fit) {
          map.fitBounds(L.latLngBounds(choice.result.routed.latlngs).pad(0.12));
        }
        const targetKm = Number(dom.targetKm.value) || choice.result.stats.distanceKm;
        const delta = choice.result.stats.distanceKm - targetKm;
        setStatus("Wczytany wariant " + (index + 1) + ". Różnica dystansu: " + delta.toFixed(1) + " km. Profil wysokości ładuje się w tle.");
        renderVariantPanel(targetKm);
        loadElevationProfile(choice.result.routed.latlngs, choice.result.stats, "OSRM bike");
      }

      function pointModeLockedWaypoints() {
        return Array.from(state.lockedWaypoints)
          .sort((a, b) => a - b)
          .filter((index) => index > 0 && index < state.waypoints.length - 1)
          .map((index) => state.waypoints[index])
          .filter(Boolean);
      }

      function makePointCandidate(targetKm, variant, forceDetour) {
        if (!state.finish) return [state.start, state.start];
        const start = state.start;
        const finish = state.finish;
        const origin = start;
        const endXy = latLngToXy(finish, origin);
        const directKm = Math.max(0.1, haversineKm(start, finish));
        const desiredKm = Math.max(targetKm, directKm);
        const dx = endXy.x;
        const dy = endXy.y;
        const len = Math.max(0.1, Math.sqrt(dx * dx + dy * dy));
        const ux = dx / len;
        const uy = dy / len;
        const px = -uy;
        const py = ux;
        const side = variant % 2 === 0 ? 1 : -1;
        const wave = 0.72 + ((variant + state.routeSearchNonce) % 5) * 0.12;
        const triangleHeight = Math.sqrt(Math.max(0, (desiredKm / 2) ** 2 - (directKm / 2) ** 2));
        const offsetKm = clamp(triangleHeight * wave, 0, Math.max(2, desiredKm * 0.42));
        const locked = pointModeLockedWaypoints();
        if (locked.length) return [start, ...locked, finish];
        if (!forceDetour && variant === 0 && (targetKm <= directKm * 1.12 || offsetKm < 1.2)) return [start, finish];
        if (forceDetour && variant === 0) return [start, finish];
        const alongShift = (((variant + state.routeSearchNonce) % 7) - 3) * 0.035 * len;
        const midX = dx * 0.5 + ux * alongShift;
        const midY = dy * 0.5 + uy * alongShift;
        const practicalOffsetKm = offsetKm < 1.2
          ? Math.max(1.8, Math.min(9, directKm * (0.08 + ((variant + state.routeSearchNonce) % 4) * 0.025)))
          : offsetKm;
        if (desiredKm > directKm * 1.75) {
          const first = xyToLatLng(dx * 0.32 + px * practicalOffsetKm * side, dy * 0.32 + py * practicalOffsetKm * side, origin);
          const second = xyToLatLng(dx * 0.68 + px * practicalOffsetKm * side * 0.68, dy * 0.68 + py * practicalOffsetKm * side * 0.68, origin);
          return [start, first, second, finish];
        }
        const detour = xyToLatLng(midX + px * practicalOffsetKm * side, midY + py * practicalOffsetKm * side, origin);
        return [start, detour, finish];
      }

      async function routeShortestPointToPoint() {
        if (state.busy) return;
        if (!state.finish) {
          setStatus("Najpierw ustaw metę prawym kliknięciem, wyszukiwarką albo przyciskiem Meta z mapy.", "warn");
          return;
        }
        state.routeSearchNonce += 1;
        state.lockedWaypoints.clear();
        const directKm = haversineKm(state.start, state.finish);
        const targetKm = Math.max(directKm + 4, directKm * 1.16);
        const attempts = clamp(Math.round(Number(dom.attempts.value) || 5), 1, 15);
        const candidates = Array.from({ length: attempts }, (_, i) => i === 0
          ? [state.start, state.finish]
          : makePointCandidate(targetKm, i + 17, true));
        const shortestScore = (item) => candidateScore(item.result, item.result.stats.distanceKm, 999) + item.result.stats.distanceKm * 115;
        let completed = 0;
        let lastError = null;
        let best = null;
        syncLabels();
        setBusy(true);
        configureBusyTimer("Liczenie A→B", estimateRouteSeconds(attempts, true));
        try {
          drawGuide(candidates[0], true);
          setStatus("Sprawdzam najbliższe warianty A→B: równolegle " + Math.min(candidateRouteConcurrency, attempts) + " naraz...");
          const explored = await mapConcurrent(candidates, candidateRouteConcurrency, async (candidate) => {
            try {
              const result = await routeAndMeasure(candidate, { analyzeOsm: false });
              const score = candidateScore(result, result.stats.distanceKm, 999) + result.stats.distanceKm * 115;
              const item = { candidate, result, score };
              completed += 1;
              setStatus("Sprawdzam najbliższe warianty A→B: " + completed + "/" + attempts + " po routingu...");
              return item;
            } catch (error) {
              lastError = error;
              completed += 1;
              setStatus("Sprawdzam najbliższe warianty A→B: " + completed + "/" + attempts + " po routingu...");
              return null;
            }
          });
          if (!explored.length) throw lastError || new Error("Brak poprawnych wariantów A→B.");
          const displayVariants = pickBestVariants(explored, savedVariantLimit, directKm);
          const finalists = displayVariants.slice(0, Math.min(finalistAnalyzeLimit, displayVariants.length));
          await analyzeVariantOsmBatch(finalists, directKm, 999, "Analizuję zasady A→B", shortestScore);
          state.variantChoices = pickBestVariants(displayVariants, savedVariantLimit, directKm);
          best = state.variantChoices[0] || displayVariants[0];
          if (!best) {
            throw new Error("Nie udało się wybrać wariantu A→B.");
          }
          applyVariantChoice(0, true);
          setStatus("Najbliższa trasa A→B gotowa. Masz " + state.variantChoices.length + " wariantów w panelu. Wybrany dystans: " + best.result.stats.distanceKm.toFixed(1) + " km, linia prosta A→B: " + directKm.toFixed(1) + " km.");
        } catch (error) {
          setStatus("Nie udało się wyznaczyć najbliższej trasy A→B: " + error.message, "bad");
        } finally {
          setBusy(false);
        }
      }

      async function findPointRoute() {
        if (state.busy) return;
        if (!state.finish) {
          setStatus("Najpierw ustaw metę: wpisz adres mety albo kliknij Meta z mapy.", "warn");
          return;
        }
        state.routeSearchNonce += 1;
        const targetKm = clamp(Number(dom.targetKm.value) || 100, 5, 260);
        const attempts = clamp(Math.round(Number(dom.attempts.value) || 5), 1, 15);
        const candidates = Array.from({ length: attempts }, (_, i) => makePointCandidate(targetKm, i, i > 0));
        let completed = 0;
        let lastError = null;
        let best = null;
        syncLabels();
        setBusy(true);
        configureBusyTimer("Liczenie A→B", estimateRouteSeconds(attempts, true));
        try {
          drawGuide(candidates[0], true);
          setStatus("Sprawdzam warianty A→B: równolegle " + Math.min(candidateRouteConcurrency, attempts) + " naraz...");
          const explored = await mapConcurrent(candidates, candidateRouteConcurrency, async (candidate) => {
            try {
              const result = await routeAndMeasure(candidate, { analyzeOsm: false });
              const distanceDelta = Math.abs(result.stats.distanceKm - targetKm);
              const shortTargetNote = result.stats.distanceKm < targetKm ? Math.max(0, targetKm - result.stats.distanceKm) : 0;
              const score = candidateScore(result, targetKm, 999) + distanceDelta * 95 + shortTargetNote * 18;
              const item = { candidate, result, score };
              completed += 1;
              setStatus("Sprawdzam warianty A→B: " + completed + "/" + attempts + " po routingu...");
              return item;
            } catch (error) {
              lastError = error;
              completed += 1;
              setStatus("Sprawdzam warianty A→B: " + completed + "/" + attempts + " po routingu...");
              return null;
            }
          });
          if (!explored.length) throw lastError || new Error("Brak poprawnych wariantów A→B.");
          const displayVariants = pickBestVariants(explored, savedVariantLimit, targetKm);
          const finalists = displayVariants.slice(0, Math.min(finalistAnalyzeLimit, displayVariants.length));
          await analyzeVariantOsmBatch(finalists, targetKm, 999, "Analizuję zasady A→B");
          state.variantChoices = pickBestVariants(displayVariants, savedVariantLimit, targetKm);
          best = state.variantChoices[0] || displayVariants[0];
          if (!best) {
            throw new Error("Nie udało się wybrać wariantu A→B.");
          }
          applyVariantChoice(0, true);
          const delta = best.result.stats.distanceKm - targetKm;
          const directKm = haversineKm(state.start, state.finish);
          const note = best.result.stats.distanceKm < targetKm
            ? " Jeśli chcesz dobić dystans, dodaj punkt pośredni lub przeciągnij trasę."
            : "";
          setStatus("Trasa A→B gotowa. Masz " + state.variantChoices.length + " wariantów w panelu. Dystans: " + best.result.stats.distanceKm.toFixed(1) + " km, cel: " + targetKm.toFixed(1) + " km, różnica: " + delta.toFixed(1) + " km. Linia prosta A→B: " + directKm.toFixed(1) + " km." + note, Math.abs(delta) > Math.max(8, targetKm * 0.18) ? "warn" : "");
        } catch (error) {
          setStatus("Nie udało się wyznaczyć trasy A→B: " + error.message, "bad");
        } finally {
          setBusy(false);
        }
      }

      function planRouteByMode() {
        if (isCustomMode()) {
          if (state.waypoints.length < 2) {
            setStatus("Tryb Własna trasa: kliknij mapę, żeby dodać pierwszy punkt za startem S.", "warn");
            return;
          }
          return routeCurrentWaypoints("Własna trasa przeliczona z klikniętych punktów.", { fit: true });
        }
        if (isPointMode()) {
          return findPointRoute();
        }
        return findFlatLoop();
      }

      async function randomizeDifferentRoute() {
        if (state.busy) return;
        rememberCurrentRouteForAvoidance();
        state.avoidPreviousRoute = true;
        state.routeSearchNonce += 7 + Math.floor(Math.random() * 31);
        const keepLocked = state.lockedWaypoints.size > 0;
        discardCurrentRouteVisuals(!keepLocked);
        if (keepLocked) redrawMarkers();
        setStatus(isCustomMode() ? "Własna trasa nie losuje wariantów. Klikaj mapę albo przeciągaj punkty, a potem przelicz." : (isPointMode() ? "Losuję inną trasę A→B..." : "Losuję zupełnie inną serię kandydatów..."), "warn");
        await planRouteByMode();
      }

      async function findFlatLoop() {
        if (state.busy) return;
        rememberCurrentRouteForAvoidance();
        state.routeSearchNonce += 1;
        const targetKm = clamp(Number(dom.targetKm.value) || 100, 5, 260);
        const maxRadiusKm = clamp(Number(dom.maxRadiusKm.value) || 25, 2, 80);
        const attempts = clamp(Math.round(Number(dom.attempts.value) || 5), 1, 15);
        const areaMode = state.areaPoints.length >= 3;
        const candidates = Array.from({ length: attempts }, (_, i) => makeLoopCandidate(targetKm, maxRadiusKm, i));
        let completed = 0;
        let lastError = null;
        let best = null;

        syncLabels();
        setBusy(true);
        configureBusyTimer("Liczenie pętli", estimateRouteSeconds(attempts, true));
        try {
          drawGuide(candidates[0], true);
          setStatus("Sprawdzam warianty pętli" + (areaMode ? " w zaznaczonym obszarze" : "") + ": równolegle " + Math.min(candidateRouteConcurrency, attempts) + " naraz...");
          const explored = await mapConcurrent(candidates, candidateRouteConcurrency, async (candidate) => {
            try {
              const item = await routeCandidateWithDistanceFit(candidate, targetKm, maxRadiusKm);
              completed += 1;
              setStatus("Sprawdzam warianty pętli: " + completed + "/" + attempts + " po routingu...");
              return item;
            } catch (error) {
              lastError = error;
              completed += 1;
              setStatus("Sprawdzam warianty pętli: " + completed + "/" + attempts + " po routingu...");
              return null;
            }
          });
          if (!explored.length) throw lastError || new Error("Brak poprawnych wariantów pętli.");

          const displayVariants = pickBestVariants(explored, savedVariantLimit, targetKm);
          const finalists = displayVariants.slice(0, Math.min(finalistAnalyzeLimit, displayVariants.length));

          drawGuide(finalists[0].candidate, true);
          await analyzeVariantOsmBatch(finalists, targetKm, maxRadiusKm, "Analizuję zasady pętli");

          state.variantChoices = pickBestVariants(displayVariants, savedVariantLimit, targetKm);
          best = state.variantChoices[0] || displayVariants[0];
          if (!best) {
            throw new Error("Nie udało się wybrać wariantu pętli.");
          }
          applyVariantChoice(0, true);
          const delta = best.result.stats.distanceKm - targetKm;
          const distanceWarn = Math.abs(delta) > Math.max(8, targetKm * 0.18);
          setStatus("Wybrany wariant 1 z " + state.variantChoices.length + ". Różnica dystansu: " + delta.toFixed(1) + " km. Ryzyko dróg: " + Math.round(best.result.stats.roadRiskPercent || 0) + "%." + (areaMode ? " Obszar jest granicą szukania, dystans jest celem." : "") + " Możesz przełączyć wariant w panelu na mapie.", distanceWarn ? "warn" : "");
          if (getLapCount() > 1) {
            const laps = getLapCount();
            const trainingKm = best.result.stats.distanceKm * laps;
            const repeatWarn = laps >= 5 && best.result.stats.distanceKm < 15 ? " Krótka pętla będzie dobra kontrolnie, ale może być monotonna." : "";
            setStatus("Trasa gotowa. Trening razem: " + trainingKm.toFixed(1) + " km (" + best.result.stats.distanceKm.toFixed(1) + " km x " + laps + " pętle)." + repeatWarn + " Warianty możesz przełączyć w panelu na mapie.", distanceWarn ? "warn" : "");
          }
        } catch (error) {
          setStatus("Nie udało się znaleźć pętli: " + error.message, "bad");
        } finally {
          setBusy(false);
        }
      }

      async function searchPlace() {
        const query = dom.searchInput.value.trim();
        if (!query) return;
        setBusy(true);
        setStatus("Szukam miejsca w OpenStreetMap...");
        dom.results.innerHTML = "";
        try {
          const url = "https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&accept-language=pl&q=" + encodeURIComponent(query);
          const data = await fetchJson(url, 20000);
          if (!data.length) {
            setStatus("Nie znaleziono miejsca.", "warn");
            return;
          }
          for (const item of data) {
            const button = document.createElement("button");
            button.className = "result";
            button.type = "button";
            button.textContent = item.display_name;
            button.addEventListener("click", () => {
              dom.results.innerHTML = "";
              setStart(L.latLng(Number(item.lat), Number(item.lon)), "Start ustawiony z wyszukiwarki OSM.");
            });
            dom.results.appendChild(button);
          }
          setStatus("Wybierz wynik z listy.");
        } catch (error) {
          setStatus("Wyszukiwarka OSM nie odpowiedziała: " + error.message, "bad");
        } finally {
          setBusy(false);
        }
      }

      async function searchFinish() {
        const query = dom.finishInput.value.trim();
        if (!query) {
          setStatus("Wpisz metę albo użyj przycisku Meta z mapy.", "warn");
          return;
        }
        setBusy(true);
        setStatus("Szukam mety w OpenStreetMap...");
        dom.results.innerHTML = "";
        try {
          const url = "https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&accept-language=pl&q=" + encodeURIComponent(query);
          const data = await fetchJson(url, 20000);
          if (!data.length) {
            setStatus("Nie znaleziono mety.", "warn");
            return;
          }
          for (const item of data) {
            const button = document.createElement("button");
            button.className = "result";
            button.type = "button";
            button.textContent = "Meta: " + item.display_name;
            button.addEventListener("click", () => {
              dom.results.innerHTML = "";
              dom.finishInput.value = item.display_name;
              const finishLatLng = L.latLng(Number(item.lat), Number(item.lon));
              setFinish(finishLatLng, "Meta ustawiona z wyszukiwarki OSM.");
              openFinishRoutePopup(finishLatLng);
            });
            dom.results.appendChild(button);
          }
          setStatus("Wybierz metę z listy.");
        } catch (error) {
          setStatus("Wyszukiwarka OSM dla mety nie odpowiedziała: " + error.message, "bad");
        } finally {
          setBusy(false);
        }
      }

      function useGps(isAutoStart) {
        if (!navigator.geolocation) {
          setStatus("Ta przeglądarka nie udostępnia GPS. Ustaw start ręcznie.", isAutoStart ? "warn" : "bad");
          return;
        }
        setBusy(true);
        setStatus(isAutoStart ? "Automatycznie pobieram aktualną lokalizację GPS..." : "Pobieram lokalizację GPS z przeglądarki...");
        navigator.geolocation.getCurrentPosition(async (position) => {
          const latlng = L.latLng(position.coords.latitude, position.coords.longitude);
          setStart(latlng, isAutoStart ? "Start automatycznie ustawiony z GPS." : "Start ustawiony z GPS.");
          map.setView(latlng, 14);
          setStatus("GPS znaleziony. Pobieram dokładny adres z OpenStreetMap...");
          try {
            const address = await reverseGeocodeLatLng(latlng);
            if (address) {
              dom.searchInput.value = address;
              setStatus((isAutoStart ? "Start automatycznie ustawiony z GPS: " : "Start ustawiony z GPS: ") + address);
            } else {
              setStatus(isAutoStart ? "Start automatycznie ustawiony z GPS, ale OSM nie zwrócił adresu." : "Start ustawiony z GPS, ale OSM nie zwrócił adresu.", "warn");
            }
          } catch (error) {
            setStatus((isAutoStart ? "Start automatycznie ustawiony z GPS. " : "Start ustawiony z GPS. ") + "Nie udało się pobrać adresu: " + error.message, "warn");
          } finally {
            setBusy(false);
          }
        }, (error) => {
          setBusy(false);
          setStatus((isAutoStart ? "Nie udało się automatycznie pobrać GPS: " : "Nie udało się pobrać GPS: ") + error.message, isAutoStart ? "warn" : "bad");
        }, {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 60000
        });
      }

      function clearRoute() {
        state.routeSearchNonce += 1;
        stopRideMode();
        discardCurrentRouteVisuals(true);
        state.avoidPreviousRoute = false;
        setStatus(isCustomMode() ? "Własna trasa wyczyszczona. Start został; klikaj mapę, żeby dodać nowe punkty." : (isPointMode() ? "Trasa A→B wyczyszczona. Start i meta zostały, możesz policzyć trasę od nowa." : "Trasa wyczyszczona. Start został, punkty pośrednie i profil usunięte."));
      }

      async function undoLastPoint() {
        if (state.busy) return;
        if (isCustomMode()) {
          if (state.waypoints.length <= 1) {
            setStatus("Własna trasa ma tylko start. Kliknij mapę, żeby dodać punkt.", "warn");
            return;
          }
          state.waypoints.pop();
          redrawMarkers();
          drawGuide(state.waypoints, false);
          if (state.waypoints.length >= 2) {
            await routeCurrentWaypoints("Ostatni punkt własnej trasy cofnięty i trasa przeliczona.");
          } else {
            discardCurrentRouteVisuals(false);
            redrawMarkers();
            drawGuide(state.waypoints, false);
            setStatus("Cofnięto ostatni punkt. Został sam start S.");
          }
          return;
        }
        if (state.waypoints.length <= 2) {
          setStatus("Nie ma punktu pośredniego do cofnięcia.", "warn");
          return;
        }
        state.waypoints.splice(state.waypoints.length - 2, 1);
        redrawMarkers();
        drawGuide(state.waypoints, false);
        await routeCurrentWaypoints("Ostatni punkt cofnięty i trasa przeliczona.");
      }

      function latLngToPlain(point) {
        return {
          lat: Number(point.lat.toFixed(7)),
          lng: Number(point.lng.toFixed(7))
        };
      }

      function plainToLatLng(point) {
        return L.latLng(Number(point.lat), Number(point.lng));
      }

      function collectProjectData() {
        return {
          app: "Planer Trasy",
          version: 3,
          savedAt: new Date().toISOString(),
          settings: {
            searchInput: dom.searchInput.value,
            finishInput: dom.finishInput.value,
            routeMode: dom.routeMode.value,
            targetKm: dom.targetKm.value,
            maxRadiusKm: dom.maxRadiusKm.value,
            lapCount: dom.lapCount.value,
            flatWeight: dom.flatWeight.value,
            maxGrade: dom.maxGrade.value,
            targetGrade: dom.targetGrade.value,
            avgSpeed: dom.avgSpeed.value,
            repeatGpx: dom.repeatGpx.checked,
            attempts: dom.attempts.value,
            roadStrictness: dom.roadStrictness.value,
            routePreset: dom.routePreset.value,
            mapStyle: dom.mapStyle.value,
            autoReroute: dom.autoReroute.checked,
            avoidNationalRoads: dom.avoidNationalRoads.checked,
            avoidVoivodeshipRoads: dom.avoidVoivodeshipRoads.checked,
            avoidForestAuto: dom.avoidForestAuto.checked,
            preferAsphalt: dom.preferAsphalt.checked,
            preferBikeRoutes: dom.preferBikeRoutes.checked,
            showFoodShops: false
          },
          start: latLngToPlain(state.start),
          finish: state.finish ? latLngToPlain(state.finish) : null,
          waypoints: state.waypoints.map(latLngToPlain),
          lockedWaypoints: Array.from(state.lockedWaypoints),
          areaPoints: state.areaPoints.map(latLngToPlain),
          routeLatLngs: state.routeLatLngs.map(latLngToPlain),
          routeFoodShops: (state.routeFoodShops || []).map((shop) => ({
            latlng: latLngToPlain(shop.latlng),
            name: shop.name,
            type: shop.type,
            distanceFromRouteKm: shop.distanceFromRouteKm,
            distanceAlongKm: shop.distanceAlongKm,
            tags: shop.tags || {}
          })),
          routeAttractions: (state.routeAttractions || []).map((item) => ({
            latlng: latLngToPlain(item.latlng),
            name: item.name,
            type: item.type,
            distanceFromRouteKm: item.distanceFromRouteKm,
            distanceAlongKm: item.distanceAlongKm,
            tags: item.tags || {}
          })),
          routeLodgings: (state.routeLodgings || []).map((item) => ({
            latlng: latLngToPlain(item.latlng),
            name: item.name,
            type: item.type,
            distanceFromRouteKm: item.distanceFromRouteKm,
            distanceAlongKm: item.distanceAlongKm,
            tags: item.tags || {}
          })),
          stats: state.stats ? {
            distanceKm: state.stats.distanceKm,
            maxRadiusKm: state.stats.maxRadiusKm,
            ascentM: state.stats.ascentM,
            maxGrade: state.stats.maxGrade,
            steepKm: state.stats.steepKm,
            elevations: state.stats.elevations || [],
            elevationEstimated: !!state.stats.elevationEstimated,
            osmAvailable: !!state.stats.osmAvailable,
            roadRiskPercent: state.stats.roadRiskPercent || 0,
            roadRiskKm: state.stats.roadRiskKm || 0,
            roadScore: state.stats.roadScore || 0,
            forbiddenKm: state.stats.forbiddenKm || 0,
            unknownRoadKm: state.stats.unknownRoadKm || 0,
            bikeKm: state.stats.bikeKm || 0,
            localRoadKm: state.stats.localRoadKm || 0,
            forestKm: state.stats.forestKm || 0,
            nationalKm: state.stats.nationalKm || 0,
            voivodeshipKm: state.stats.voivodeshipKm || 0,
            unpavedKm: state.stats.unpavedKm || 0,
            roadSamples: Array.isArray(state.stats.roadSamples) ? state.stats.roadSamples : []
          } : null
        };
      }

      function saveProject() {
        const project = collectProjectData();
        const blob = new Blob([JSON.stringify(project, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "planer-trasy-projekt-" + new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-") + ".json";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
        setStatus("Projekt zapisany do JSON.");
      }

      function applyProject(project) {
        if (!project || !project.start) {
          throw new Error("To nie wygląda jak projekt Planera Trasy.");
        }
        const settings = project.settings || {};
        for (const [key, value] of Object.entries(settings)) {
          if (!dom[key]) continue;
          if (dom[key].type === "checkbox") dom[key].checked = !!value;
          else dom[key].value = value;
        }

        
        if (dom.showFoodShops) dom.showFoodShops.checked = false;
        if (dom.showAttractions) dom.showAttractions.checked = false;
state.profileRequestId += 1;
        state.start = plainToLatLng(project.start);
        state.finish = project.finish ? plainToLatLng(project.finish) : null;
        state.waypoints = Array.isArray(project.waypoints) && project.waypoints.length >= 2
          ? project.waypoints.map(plainToLatLng)
          : (isCustomMode() ? [state.start] : (isPointMode() && state.finish ? [state.start, state.finish] : [state.start, state.start]));
        state.lockedWaypoints = new Set(Array.isArray(project.lockedWaypoints) ? project.lockedWaypoints.map(Number).filter((value) => value > 0) : []);
        normalizeLockedWaypoints();
        state.areaPoints = Array.isArray(project.areaPoints) ? project.areaPoints.map(plainToLatLng) : [];
        state.routeLatLngs = Array.isArray(project.routeLatLngs) ? project.routeLatLngs.map(plainToLatLng) : [];
        const loadedRouteFoodShops = Array.isArray(project.routeFoodShops) ? project.routeFoodShops.map((shop) => ({
          latlng: plainToLatLng(shop.latlng),
          name: shop.name || shopTypeLabel(shop.tags && shop.tags.shop),
          type: shop.type || shopTypeLabel(shop.tags && shop.tags.shop),
          distanceFromRouteKm: Number(shop.distanceFromRouteKm) || 0,
          distanceAlongKm: Number(shop.distanceAlongKm) || 0,
          tags: shop.tags || {}
        })) : [];
        const loadedRouteAttractions = Array.isArray(project.routeAttractions) ? project.routeAttractions.map((item) => ({
          latlng: plainToLatLng(item.latlng),
          name: item.name || attractionTypeLabel(item.tags || {}),
          type: item.type || attractionTypeLabel(item.tags || {}),
          distanceFromRouteKm: Number(item.distanceFromRouteKm) || 0,
          distanceAlongKm: Number(item.distanceAlongKm) || 0,
          tags: item.tags || {}
        })) : [];
        const loadedRouteLodgings = Array.isArray(project.routeLodgings) ? project.routeLodgings.map((item) => ({
          latlng: plainToLatLng(item.latlng),
          name: item.name || lodgingTypeLabel(item.tags || {}),
          type: item.type || lodgingTypeLabel(item.tags || {}),
          distanceFromRouteKm: Number(item.distanceFromRouteKm) || 0,
          distanceAlongKm: Number(item.distanceAlongKm) || 0,
          tags: item.tags || {}
        })) : [];
        state.routeFoodShops = loadedRouteFoodShops;
        state.routeAttractions = loadedRouteAttractions;
        state.routeLodgings = loadedRouteLodgings;
        state.profileHoverIndex = -1;
        updateRadiusCircle();
        updateAreaLayers();
        syncLabels();
        switchMapLayer(dom.mapStyle.value);
        syncRouteModeControls();
        redrawMarkers();
        routeLayer.clearLayers();
        manualCorrectionLayer.clearLayers();
        routeHitLayer.clearLayers();
        guideLayer.setLatLngs([]);

        if (state.routeLatLngs.length >= 2) {
          const savedStats = project.stats || {};
          const stats = measureStats(
            state.routeLatLngs,
            Number(savedStats.distanceKm) || routeDistanceKm(state.routeLatLngs),
            Array.isArray(savedStats.elevations) ? savedStats.elevations.map(Number) : [],
            savedStats
          );
          stats.elevationEstimated = !!savedStats.elevationEstimated;
          setRoute(state.routeLatLngs, stats, "projekt");
          state.routeFoodShops = loadedRouteFoodShops;
          if (loadedRouteFoodShops.length || loadedRouteAttractions.length || loadedRouteLodgings.length) {
            drawRouteFoodShops(state.routeFoodShops);
            drawRouteAttractions(state.routeAttractions);
            drawRouteLodgings(state.routeLodgings);
            renderRouteReport("Co jest przy trasie");
          }
          map.fitBounds(L.latLngBounds(state.routeLatLngs).pad(0.12));
        } else {
          updateMetrics(null, "projekt");
          drawProfile([]);
          map.setView(state.start, Math.max(map.getZoom(), 12));
        }
        if (dom.showFoodShops.checked) {
          scheduleFoodShopRefresh();
        } else {
          foodShopLayer.clearLayers();
        }
        syncFoodShopButtons();
      syncAttractionButtons();
        setStatus("Projekt wczytany.");
      }

      function loadProjectFile(file) {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          try {
            applyProject(JSON.parse(String(reader.result || "")));
          } catch (error) {
            setStatus("Nie udało się wczytać projektu: " + error.message, "bad");
          } finally {
            dom.loadProjectFile.value = "";
          }
        };
        reader.readAsText(file, "utf-8");
      }

      function buildGpxText() {
        if (!state.routeLatLngs.length) {
          return "";
        }
        const xmlEscape = (value) => String(value == null ? "" : value)
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;");
        const laps = getLapCount();
        const repeatRoute = dom.repeatGpx.checked && laps > 1;
        const points = [];
        for (let lap = 0; lap < (repeatRoute ? laps : 1); lap += 1) {
          state.routeLatLngs.forEach((point, index) => {
            if (lap > 0 && index === 0) return;
            points.push(point);
          });
        }
        const distanceKm = (state.stats ? state.stats.distanceKm : routeDistanceKm(state.routeLatLngs)) * (repeatRoute ? laps : 1);
        const name = "petla-rowerowa-" + (repeatRoute ? laps + "x-" : "") + new Date().toISOString().slice(0, 10);
        const desc = repeatRoute
          ? "Pelny trening: " + laps + " petli, okolo " + distanceKm.toFixed(1) + " km."
          : "Jedna petla, okolo " + distanceKm.toFixed(1) + " km.";
        const shopWaypoints = (state.routeFoodShops || []).slice(0, 35).map((shop) => [
          '  <wpt lat="' + shop.latlng.lat.toFixed(7) + '" lon="' + shop.latlng.lng.toFixed(7) + '">',
          "    <name>" + xmlEscape("Sklep km " + shop.distanceAlongKm.toFixed(1) + " - " + shop.name) + "</name>",
          "    <desc>" + xmlEscape(shop.type + ", " + Math.round(shop.distanceFromRouteKm * 1000) + " m od trasy") + "</desc>",
          "    <sym>Shopping Center</sym>",
          "  </wpt>"
        ].join("\n")).join("\n");
        const attractionWaypoints = (state.routeAttractions || []).slice(0, 35).map((item) => [
          '  <wpt lat="' + item.latlng.lat.toFixed(7) + '" lon="' + item.latlng.lng.toFixed(7) + '">',
          "    <name>" + xmlEscape("Atrakcja km " + item.distanceAlongKm.toFixed(1) + " - " + item.name) + "</name>",
          "    <desc>" + xmlEscape(item.type + ", " + Math.round(item.distanceFromRouteKm * 1000) + " m od trasy") + "</desc>",
          "    <sym>Scenic Area</sym>",
          "  </wpt>"
        ].join("\n")).join("\n");
        const lodgingWaypoints = (state.routeLodgings || []).slice(0, 35).map((item) => [
          '  <wpt lat="' + item.latlng.lat.toFixed(7) + '" lon="' + item.latlng.lng.toFixed(7) + '">',
          "    <name>" + xmlEscape("Nocleg km " + item.distanceAlongKm.toFixed(1) + " - " + item.name) + "</name>",
          "    <desc>" + xmlEscape(item.type + ", " + Math.round(item.distanceFromRouteKm * 1000) + " m od trasy") + "</desc>",
          "    <sym>Lodging</sym>",
          "  </wpt>"
        ].join("\n")).join("\n");
        const waypoints = [shopWaypoints, attractionWaypoints, lodgingWaypoints].filter(Boolean).join("\n");
        const trkpts = points.map((point) => '      <trkpt lat="' + point.lat.toFixed(7) + '" lon="' + point.lng.toFixed(7) + '"></trkpt>').join("\n");
        return [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<gpx version="1.1" creator="Planer petli rowerowej" xmlns="http://www.topografix.com/GPX/1/1">',
          waypoints,
          "  <trk>",
          "    <name>" + xmlEscape(name) + "</name>",
          "    <desc>" + xmlEscape(desc) + "</desc>",
          "    <trkseg>",
          trkpts,
          "    </trkseg>",
          "  </trk>",
          "</gpx>"
        ].join("\n");
      }

      function exportGpx() {
        if (!state.routeLatLngs.length) {
          setStatus("Brak trasy do eksportu.", "warn");
          return;
        }
        const laps = getLapCount();
        const repeatRoute = dom.repeatGpx.checked && laps > 1;
        const name = "petla-rowerowa-" + (repeatRoute ? laps + "x-" : "") + new Date().toISOString().slice(0, 10);
        const gpx = buildGpxText();
        const blob = new Blob([gpx], { type: "application/gpx+xml" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = name + ".gpx";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
        setStatus("GPX wyeksportowany" + (repeatRoute ? ": pełny trening " + laps + " pętli." : ": jedna pętla.") );
      }

      function parseGpxData(text) {
        const doc = new DOMParser().parseFromString(text, "application/xml");
        const error = doc.querySelector("parsererror");
        if (error) throw new Error("Plik GPX ma błąd XML.");
        const selectors = ["trkpt", "rtept", "wpt"];
        const points = [];
        const elevations = [];
        for (const selector of selectors) {
          const nodes = Array.from(doc.getElementsByTagName(selector));
          if (!nodes.length) continue;
          for (const node of nodes) {
            const lat = Number(node.getAttribute("lat"));
            const lng = Number(node.getAttribute("lon"));
            if (Number.isFinite(lat) && Number.isFinite(lng)) {
              const eleNode = node.getElementsByTagName("ele")[0];
              const elevation = eleNode ? Number(eleNode.textContent) : null;
              points.push(L.latLng(lat, lng));
              elevations.push(Number.isFinite(elevation) ? elevation : null);
            }
          }
          if (points.length >= 2) break;
        }
        if (points.length < 2) throw new Error("Nie znalazłem w GPX minimum dwóch punktów trasy.");
        const cleanPoints = [];
        const cleanElevations = [];
        points.forEach((point, index) => {
          if (index === 0 || haversineKm(points[index - 1], point) > 0.002) {
            cleanPoints.push(point);
            cleanElevations.push(elevations[index]);
          }
        });
        const validElevationCount = cleanElevations.filter((value) => Number.isFinite(value)).length;
        const filledElevations = cleanElevations.slice();
        if (validElevationCount >= 2) {
          for (let i = 0; i < filledElevations.length; i += 1) {
            if (!Number.isFinite(filledElevations[i]) && i > 0) filledElevations[i] = filledElevations[i - 1];
          }
          for (let i = filledElevations.length - 1; i >= 0; i -= 1) {
            if (!Number.isFinite(filledElevations[i]) && i < filledElevations.length - 1) filledElevations[i] = filledElevations[i + 1];
          }
        }
        return {
          points: cleanPoints,
          elevations: validElevationCount >= 2 ? filledElevations : []
        };
      }

      function controlPointsFromRoute(points) {
        const count = Math.min(12, Math.max(3, Math.round(routeDistanceKm(points) / 12)));
        const controls = sampleRoute(points, count);
        if (controls.length >= 2 && haversineKm(controls[0], controls[controls.length - 1]) < 0.12) {
          controls[controls.length - 1] = controls[0];
        }
        return controls;
      }

      function importGpxText(text, fileName) {
        const gpx = parseGpxData(text);
        const points = gpx.points;
        state.profileRequestId += 1;
        state.mode = "imported";
        state.routeSearchNonce += 1;
        state.variantChoices = [];
        state.activeVariantIndex = -1;
        state.lockedWaypoints.clear();
        state.start = points[0];
        state.waypoints = controlPointsFromRoute(points);
        state.areaPoints = [];
        updateAreaLayers();
        updateRadiusCircle();
        redrawMarkers();
        guideLayer.setLatLngs([]);
        const stats = measureStats(points, routeDistanceKm(points), gpx.elevations, emptyOsmStats());
        if (dom.routeMode) dom.routeMode.value = "custom";
        dom.targetKm.value = clamp(Math.round(stats.distanceKm), 5, 260);
        syncLabels();
        setRoute(points, stats, "GPX");
        map.fitBounds(L.latLngBounds(points).pad(0.12));
        if (gpx.elevations.length >= 2) {
          setStatus("GPX wczytany: " + (fileName || "plik") + ". Dystans " + stats.distanceKm.toFixed(1) + " km. Profil wysokości użyty z pliku. Możesz edytować punkty jak normalną trasę.");
        } else {
          setStatus("GPX wczytany: " + (fileName || "plik") + ". Dystans " + stats.distanceKm.toFixed(1) + " km. Profil wysokości ładuje się w tle. Możesz edytować punkty jak normalną trasę.");
          loadElevationProfile(points, stats, "GPX");
        }
      }

      function importGpxFile(file) {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          try {
            importGpxText(String(reader.result || ""), file.name);
          } catch (error) {
            setStatus("Nie udało się wczytać GPX: " + error.message, "bad");
          } finally {
            dom.importGpxFile.value = "";
          }
        };
        reader.readAsText(file, "utf-8");
      }

      let bikeAnalyzerBridgeTimer = null;
      let bikeAnalyzerBridgeButton = null;
      let bikeAnalyzerBridgeLastSignature = "";

      function setupBikeAnalyzerBridge() {}

      function bikeAnalyzerBridgeRequested() {
        return false;
      }

      function createBikeAnalyzerBridgePanel() {}

      function scheduleBikeAnalyzerProfilePush(reason) {}

      function sendBikeAnalyzerProfile(reason) {}
      function buildBikeAnalyzerPayload(reason) {
        if (!state.stats || !state.routeLatLngs || state.routeLatLngs.length < 2 || !dom.profileCanvas) return null;
        const profileImage = state.profileElevations && state.profileElevations.length >= 2
          ? dom.profileCanvas.toDataURL("image/png")
          : "";
        const routePoints = downsampleBridgeArray(state.routeLatLngs, 900).map((point) => ({
          lat: Number(point.lat),
          lon: Number(point.lng)
        }));
        const elevations = state.profileSmoothElevations && state.profileSmoothElevations.length === state.profileElevations.length
          ? state.profileSmoothElevations
          : state.profileElevations;
        const profileSamples = downsampleBridgeArray((elevations || []).map((elevation, index) => ({
          distanceKm: Number(state.profileDistances[index] || 0),
          elevationM: Number(elevation)
        })), 420).filter((sample) => Number.isFinite(sample.elevationM));
        return {
          version: 1,
          source: "Planer Trasy",
          reason,
          transferredAt: new Date().toISOString(),
          title: "Trasa z Planera Trasy",
          route: {
            distanceKm: Number(state.stats.distanceKm || routeDistanceKm(state.routeLatLngs) || 0),
            ascentM: Number(state.stats.ascentM || 0),
            maxGrade: Number(state.stats.maxGrade || 0),
            forestKm: Number(state.stats.forestKm || 0),
            roadRiskPercent: Number(state.stats.roadRiskPercent || 0),
            calories: Number(calorieEstimate(state.stats) || 0),
            estimatedTimeText: dom.timeEstimateOut ? dom.timeEstimateOut.textContent : "",
            mode: dom.routeMode ? dom.routeMode.value : "",
            preset: dom.routePreset ? dom.routePreset.value : ""
          },
          profile: {
            imageDataUrl: profileImage,
            infoText: dom.profileInfo ? dom.profileInfo.textContent : "",
            samples: profileSamples
          },
          points: routePoints
        };
      }

      function downsampleBridgeArray(items, maxItems) {
        if (!Array.isArray(items) || items.length <= maxItems) return items || [];
        const result = [];
        const step = (items.length - 1) / (maxItems - 1);
        for (let index = 0; index < maxItems; index += 1) {
          result.push(items[Math.round(index * step)]);
        }
        return result;
      }
      function canvasToPngBlob(canvas) {
        return new Promise((resolve, reject) => {
          try {
            canvas.toBlob((blob) => {
              if (blob) resolve(blob);
              else reject(new Error("Nie udało się przygotować pliku PNG."));
            }, "image/png");
          } catch (error) {
            reject(error);
          }
        });
      }

      function nextPaint(frames) {
        const total = Math.max(1, frames || 1);
        return new Promise((resolve) => {
          function step(left) {
            window.requestAnimationFrame(() => {
              if (left <= 1) resolve();
              else step(left - 1);
            });
          }
          step(total);
        });
      }

      function screenshotScaleFor(target) {
        const width = Math.max(1, target.scrollWidth || target.clientWidth || window.innerWidth);
        const height = Math.max(1, target.scrollHeight || target.clientHeight || window.innerHeight);
        const preferred = Math.max(3, Math.min(4, window.devicePixelRatio || 1));
        const maxPixels = 24000000;
        const safeScale = Math.sqrt(maxPixels / Math.max(1, width * height));
        return Math.max(2, Math.min(preferred, safeScale));
      }

      async function captureMapCanvas() {
        if (!window.html2canvas) {
          throw new Error("Biblioteka zrzutu ekranu nie została wczytana.");
        }
        const target = document.querySelector(".map-wrap");
        if (!target) {
          throw new Error("Nie znaleziono mapy do zrzutu.");
        }
        if (document.fonts && document.fonts.ready) await document.fonts.ready;
        map.invalidateSize();
        drawProfile(state.stats ? state.stats.elevations : []);
        await nextPaint(2);
        return window.html2canvas(target, {
          backgroundColor: "#03050d",
          useCORS: true,
          allowTaint: false,
          imageTimeout: 30000,
          logging: false,
          scale: screenshotScaleFor(target),
          windowWidth: target.scrollWidth,
          windowHeight: target.scrollHeight,
          scrollX: -window.scrollX,
          scrollY: -window.scrollY,
          ignoreElements: (element) => element.classList && (
            element.classList.contains("leaflet-control-attribution") ||
            element.classList.contains("screenshot-ignore")
          )
        });
      }

      function downloadPngBlob(blob) {
        const name = "mapa-profil-trasy-" + new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-") + ".png";
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      }

      function currentFullscreenElement() {
        return document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement || null;
      }

      function setTopMenuCollapsed(collapsed) {
        document.body.classList.toggle("top-menu-collapsed", collapsed);
        if (dom.topMenuToggleBtn) {
          dom.topMenuToggleBtn.textContent = collapsed ? "Rozwiń górne menu" : "Zwiń górne menu";
          dom.topMenuToggleBtn.setAttribute("aria-expanded", collapsed ? "false" : "true");
        }
        window.setTimeout(() => {
          map.invalidateSize();
          drawProfile(state.stats ? state.stats.elevations : []);
        }, 120);
      }

      function toggleTopMenu() {
        setTopMenuCollapsed(!document.body.classList.contains("top-menu-collapsed"));
      }

      function setMapMenuOpen(open) {
        const menu = document.querySelector(".map-bottom-actions");
        if (!menu || !dom.mapMenuToggleBtn) return;
        menu.classList.toggle("collapsed", !open);
        dom.mapMenuToggleBtn.textContent = open ? "Zwiń" : "Menu mapy";
        dom.mapMenuToggleBtn.setAttribute("aria-expanded", open ? "true" : "false");
      }

      function toggleMapMenu() {
        const menu = document.querySelector(".map-bottom-actions");
        setMapMenuOpen(!(menu && !menu.classList.contains("collapsed")));
      }

      function setFullscreenMapMenuOpen(open) {
        const menu = document.querySelector(".fullscreen-map-actions");
        if (!menu || !dom.fullscreenMenuToggleBtn) return;
        menu.classList.toggle("collapsed", !open);
        dom.fullscreenMenuToggleBtn.textContent = open ? "Zwiń" : "Menu";
        dom.fullscreenMenuToggleBtn.setAttribute("aria-expanded", open ? "true" : "false");
      }

      function toggleFullscreenMapMenu() {
        const menu = document.querySelector(".fullscreen-map-actions");
        setFullscreenMapMenuOpen(!(menu && !menu.classList.contains("collapsed")));
      }
      function syncFullscreenButton() {
        const mapWrap = document.querySelector(".map-wrap");
        const isFullscreen = !!currentFullscreenElement();
        if (mapWrap) mapWrap.classList.toggle("fullscreen-active", isFullscreen);
        if (dom.fullscreenBtn) dom.fullscreenBtn.textContent = isFullscreen ? "Zamknij pełny" : "Pełny ekran";
        if (dom.quickFullscreenBtn) dom.quickFullscreenBtn.textContent = isFullscreen ? "Zamknij widok" : "Pełny widok";
        if (!isFullscreen) setFullscreenMapMenuOpen(true);
        window.setTimeout(() => {
          map.invalidateSize();
          drawProfile(state.stats ? state.stats.elevations : []);
        }, 120);
      }

      async function toggleMapFullscreen() {
        const mapWrap = document.querySelector(".map-wrap");
        if (!mapWrap) return;
        try {
          if (currentFullscreenElement()) {
            if (document.exitFullscreen) await document.exitFullscreen();
            else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
            else if (document.msExitFullscreen) document.msExitFullscreen();
            return;
          }
          if (mapWrap.requestFullscreen) await mapWrap.requestFullscreen();
          else if (mapWrap.webkitRequestFullscreen) mapWrap.webkitRequestFullscreen();
          else if (mapWrap.msRequestFullscreen) mapWrap.msRequestFullscreen();
          else throw new Error("Ta przeglądarka nie obsługuje pełnego ekranu.");
        } catch (error) {
          setStatus("Nie udało się włączyć pełnego ekranu mapy: " + error.message, "bad");
        } finally {
          syncFullscreenButton();
        }
      }

      function captureBounds() {
        const route = state.routeLatLngs && state.routeLatLngs.length >= 2 ? state.routeLatLngs : [];
        const guide = state.waypoints && state.waypoints.length >= 2 ? state.waypoints : [];
        const area = state.areaPoints && state.areaPoints.length >= 3 ? state.areaPoints : [];
        const points = route.length ? route.concat(guide) : (guide.length ? guide : area);
        const valid = points.filter((point) => point && Number.isFinite(point.lat) && Number.isFinite(point.lng));
        if (valid.length < 2) return null;
        const bounds = L.latLngBounds(valid);
        return bounds.isValid() ? bounds : null;
      }

      function waitForMapRender(timeoutMs) {
        return new Promise((resolve) => {
          let done = false;
          const finish = () => {
            if (done) return;
            done = true;
            resolve();
          };
          if (activeBaseLayer && activeBaseLayer._loading) {
            activeBaseLayer.once("load", finish);
          }
          window.setTimeout(finish, timeoutMs || 1800);
        });
      }

      function visibleMapTiles() {
        const mapElement = document.getElementById("map");
        if (!mapElement) return [];
        const mapRect = mapElement.getBoundingClientRect();
        return Array.from(mapElement.querySelectorAll("img.leaflet-tile")).filter((tile) => {
          const rect = tile.getBoundingClientRect();
          const intersects = rect.width > 0 && rect.height > 0 && rect.right > mapRect.left && rect.bottom > mapRect.top && rect.left < mapRect.right && rect.top < mapRect.bottom;
          return intersects && !tile.classList.contains("leaflet-tile-error");
        });
      }

      async function decodeVisibleTiles() {
        const tiles = visibleMapTiles();
        await Promise.all(tiles.map((tile) => {
          if (tile.decode) return tile.decode().catch(() => {});
          return Promise.resolve();
        }));
      }

      function waitForVisibleTiles(timeoutMs) {
        return new Promise((resolve) => {
          const start = Date.now();
          const timeout = timeoutMs || 6500;
          function ready() {
            const visibleTiles = visibleMapTiles();
            if (!visibleTiles.length) return false;
            return visibleTiles.every((tile) => tile.complete && tile.naturalWidth > 0 && tile.classList.contains("leaflet-tile-loaded"));
          }
          async function tick() {
            if (ready() || Date.now() - start > timeout) {
              await decodeVisibleTiles();
              await nextPaint(2);
              resolve();
              return;
            }
            window.setTimeout(tick, 120);
          }
          tick();
        });
      }

      async function withScreenshotSafeMap(callback) {
        const previousStyle = dom.mapStyle ? dom.mapStyle.value : "osm";
        const shouldSwitch = previousStyle !== "osm";
        if (shouldSwitch) {
          switchMapLayer("osm");
          setStatus("Na czas PNG przełączam podkład na OpenStreetMap, bo część map blokuje zapis obrazu.", "warn");
        }
        map.invalidateSize();
        await waitForMapRender(2500);
        await waitForVisibleTiles(7000);
        try {
          return await callback();
        } finally {
          if (shouldSwitch) {
            switchMapLayer(previousStyle);
            map.invalidateSize();
            await waitForMapRender(900);
          }
        }
      }

      async function withRouteFittedForCapture(callback) {
        const bounds = captureBounds();
        const previousCenter = map.getCenter();
        const previousZoom = map.getZoom();
        const hadBounds = bounds && bounds.isValid();
        if (hadBounds) {
          map.fitBounds(bounds.pad(0.1), {
            animate: false,
            paddingTopLeft: [16, 96],
            paddingBottomRight: [16, 132]
          });
          map.invalidateSize();
          drawProfile(state.stats ? state.stats.elevations : []);
          await waitForMapRender(2500);
          await waitForVisibleTiles(7000);
        }
        try {
          return await withScreenshotSafeMap(callback);
        } finally {
          if (hadBounds) {
            map.setView(previousCenter, previousZoom, { animate: false });
            map.invalidateSize();
            drawProfile(state.stats ? state.stats.elevations : []);
            await waitForMapRender(500);
          }
        }
      }

      async function downloadScreenshot() {
        if (state.busy) return;
        try {
          setBusy(true);
          setStatus("Dopasowuję mapę do całej trasy i tworzę PNG...");
          const canvas = await withRouteFittedForCapture(() => captureMapCanvas());
          const blob = await canvasToPngBlob(canvas);
          downloadPngBlob(blob);
          setStatus("Zrzut mapy z profilem pobrany jako PNG.");
        } catch (error) {
          setStatus("Nie udało się zrobić zrzutu: " + error.message, "bad");
        } finally {
          setBusy(false);
        }
      }

      async function copyScreenshot() {
        if (state.busy) return;
        try {
          setBusy(true);
          setStatus("Dopasowuję mapę do całej trasy i kopiuję PNG...");
          const canvas = await withRouteFittedForCapture(() => captureMapCanvas());
          const blob = await canvasToPngBlob(canvas);
          if (!navigator.clipboard || !window.ClipboardItem) {
            downloadPngBlob(blob);
            setStatus("Przeglądarka blokuje kopiowanie obrazu, więc pobrałem PNG.", "warn");
            return;
          }
          await navigator.clipboard.write([
            new ClipboardItem({ "image/png": blob })
          ]);
          setStatus("Zrzut mapy z profilem skopiowany do schowka.");
        } catch (error) {
          try {
            const canvas = await withRouteFittedForCapture(() => captureMapCanvas());
            const blob = await canvasToPngBlob(canvas);
            downloadPngBlob(blob);
            setStatus("Schowek zablokowany, więc pobrałem PNG.", "warn");
          } catch (fallbackError) {
            setStatus("Nie udało się skopiować zrzutu: " + error.message, "bad");
          }
        } finally {
          setBusy(false);
        }
      }

      function updateAreaLayers() {
        if (state.areaPoints.length >= 3) {
          areaLayer.setLatLngs([state.areaPoints]);
          areaSketchLayer.setLatLngs([]);
        } else {
          areaLayer.setLatLngs([]);
          areaSketchLayer.setLatLngs(state.areaPoints);
        }
      }

      function clearArea() {
        state.routeSearchNonce += 1;
        state.areaPoints = [];
        state.drawingArea = false;
        state.areaMouseDown = false;
        areaLayer.setLatLngs([]);
        areaSketchLayer.setLatLngs([]);
        dom.drawAreaBtn.classList.remove("violet");
        enableMapGesturesAfterArea();
        updateRadiusCircle();
        discardCurrentRouteVisuals(true);
        if (!isPointMode() && !isCustomMode()) previewNextLoopSketch();
        setStatus(isCustomMode() ? "Obszar wyczyszczony. Tryb Własna trasa dalej działa kliknięciami na mapie." : (isPointMode() ? "Obszar wyczyszczony. Tryb Start → Meta nadal używa startu i mety." : "Obszar i stara trasa wyczyszczone. Generator znów używa promienia od startu i nowej serii wariantów."));
      }

      function disableMapGesturesForArea() {
        map.getContainer().classList.add("area-drawing-active");
        map.dragging.disable();
        if (map.touchZoom) map.touchZoom.disable();
        if (map.tap) map.tap.disable();
        if (map.boxZoom) map.boxZoom.disable();
        if (map.doubleClickZoom) map.doubleClickZoom.disable();
      }

      function enableMapGesturesAfterArea() {
        map.getContainer().classList.remove("area-drawing-active");
        map.dragging.enable();
        if (map.touchZoom) map.touchZoom.enable();
        if (map.tap) map.tap.enable();
        if (map.boxZoom) map.boxZoom.enable();
        if (map.doubleClickZoom) map.doubleClickZoom.enable();
      }

      function beginAreaDrawing(latlng, originalEvent) {
        if (!state.drawingArea || state.busy) return;
        state.areaMouseDown = true;
        state.areaPoints = [latlng];
        disableMapGesturesForArea();
        updateAreaLayers();
        if (originalEvent) {
          L.DomEvent.preventDefault(originalEvent);
          L.DomEvent.stop(originalEvent);
        }
      }

      function extendAreaDrawing(latlng) {
        if (!state.areaMouseDown) return;
        const last = state.areaPoints[state.areaPoints.length - 1];
        if (!last || haversineKm(last, latlng) > 0.03) {
          state.areaPoints.push(latlng);
          updateAreaLayers();
        }
      }

      function finishAreaDrawing() {
        if (!state.areaMouseDown) return;
        state.areaMouseDown = false;
        state.drawingArea = false;
        state.suppressMapClickUntil = Date.now() + 700;
        dom.drawAreaBtn.classList.remove("violet");
        enableMapGesturesAfterArea();
        if (state.areaPoints.length >= 3) {
          if (dom.routeMode.value !== "loop") {
            dom.routeMode.value = "loop";
            syncRouteModeControls();
          }
          updateAreaLayers();
          const startInArea = areaCentroid();
          setStart(startInArea, "Start pętli ustawiony w środku narysowanego obszaru.", { keepView: true });
          state.routeSearchNonce += 1;
          previewNextLoopSketch();
          setStatus("Obszar zapisany. Start pętli jest teraz w zaznaczonym obszarze, a generator będzie szukał trasy właśnie tam.");
        } else {
          clearArea();
          setStatus("Obszar był za mały. Spróbuj narysować większy kształt.", "warn");
        }
      }

      function pointerLatLng(event) {
        return map.mouseEventToLatLng(event);
      }

      function touchLatLng(event) {
        const touch = event.touches && event.touches[0]
          ? event.touches[0]
          : (event.changedTouches && event.changedTouches[0] ? event.changedTouches[0] : null);
        return touch ? map.mouseEventToLatLng(touch) : null;
      }

      map.getContainer().addEventListener("contextmenu", (event) => {
        event.preventDefault();
      });

      map.on("contextmenu", (event) => {
        if (event.originalEvent) {
          L.DomEvent.preventDefault(event.originalEvent);
          L.DomEvent.stop(event.originalEvent);
        }
        if (state.drawingArea || state.areaMouseDown) {
          return;
        }
        if (state.busy) return;
        state.pickingStart = false;
        state.pickingFinish = false;
        state.addingPoint = false;
        state.drawingArea = false;
        state.areaMouseDown = false;
        dom.pickStartBtn.classList.remove("blue");
        dom.pickFinishBtn.classList.remove("blue");
        dom.addPointBtn.classList.remove("blue");
        dom.drawAreaBtn.classList.remove("violet");
        setFinish(event.latlng, "Meta ustawiona prawym kliknięciem na mapie.", { keepView: true });
        openFinishRoutePopup(event.latlng);
      });

      map.on("mousedown", (event) => {
        if (!state.drawingArea || state.busy) return;
        if (event.originalEvent && event.originalEvent.pointerType && event.originalEvent.pointerType !== "mouse") return;
        if (!event.originalEvent || event.originalEvent.button !== 2) {
          setStatus("Obszar rysuj prawym przyciskiem myszy.", "warn");
          return;
        }
        beginAreaDrawing(event.latlng, event.originalEvent);
      });

      map.on("mousemove", (event) => {
        if (state.areaMouseDown) {
          extendAreaDrawing(event.latlng);
          return;
        }
        if (state.busy || state.pickingStart || state.pickingFinish || state.addingPoint || state.drawingArea) {
          hideRouteHoverIfVisible();
          return;
        }
        const projection = closestRouteProjection(event.latlng, 24);
        if (projection) setProfileHover(projection.profileIndex, projection.distanceAlongKm, projection.point);
        else hideRouteHoverIfVisible();
      });

      map.on("mouseup", (event) => {
        if (!state.areaMouseDown) return;
        if (event.originalEvent && event.originalEvent.button !== 2) return;
        finishAreaDrawing();
      });

      const mapContainer = map.getContainer();
      mapContainer.addEventListener("pointerdown", (event) => {
        if (!state.drawingArea || state.busy || event.pointerType === "mouse") return;
        if (!event.isPrimary) return;
        mapContainer.setPointerCapture(event.pointerId);
        beginAreaDrawing(pointerLatLng(event), event);
      }, { passive: false });

      mapContainer.addEventListener("pointermove", (event) => {
        if (!state.areaMouseDown || event.pointerType === "mouse") return;
        extendAreaDrawing(pointerLatLng(event));
        event.preventDefault();
      }, { passive: false });

      mapContainer.addEventListener("pointerup", (event) => {
        if (!state.areaMouseDown || event.pointerType === "mouse") return;
        try {
          mapContainer.releasePointerCapture(event.pointerId);
        } catch (error) {}
        finishAreaDrawing();
        event.preventDefault();
      }, { passive: false });

      mapContainer.addEventListener("pointercancel", (event) => {
        if (!state.areaMouseDown || event.pointerType === "mouse") return;
        try {
          mapContainer.releasePointerCapture(event.pointerId);
        } catch (error) {}
        finishAreaDrawing();
      }, { passive: false });

      mapContainer.addEventListener("touchstart", (event) => {
        if (!state.drawingArea || state.busy || state.areaMouseDown) return;
        if (!event.touches || event.touches.length !== 1) return;
        const latlng = touchLatLng(event);
        if (!latlng) return;
        beginAreaDrawing(latlng, event);
      }, { passive: false });

      mapContainer.addEventListener("touchmove", (event) => {
        if (!state.areaMouseDown) return;
        const latlng = touchLatLng(event);
        if (!latlng) return;
        extendAreaDrawing(latlng);
        event.preventDefault();
      }, { passive: false });

      mapContainer.addEventListener("touchend", (event) => {
        if (!state.areaMouseDown) return;
        finishAreaDrawing();
        event.preventDefault();
      }, { passive: false });

      mapContainer.addEventListener("touchcancel", (event) => {
        if (!state.areaMouseDown) return;
        finishAreaDrawing();
        event.preventDefault();
      }, { passive: false });

      routeHitLayer.on("mousedown", (event) => {
        if (state.busy || state.pickingStart || state.pickingFinish || state.addingPoint || state.drawingArea || state.areaMouseDown) return;
        if (state.manualCorrectionMode) {
          if (event.originalEvent) L.DomEvent.stop(event.originalEvent);
          openManualCorrectionAt(event.latlng);
          return;
        }
        if (event.originalEvent) L.DomEvent.stop(event.originalEvent);
        const index = insertPointOnRoute(event.latlng);
        if (index > 0) {
          startLineDrag(index, event.originalEvent);
        }
      });

      routeHitLayer.on("mousemove", (event) => {
        const projection = closestRouteProjection(event.latlng, 30);
        if (projection) setProfileHover(projection.profileIndex, projection.distanceAlongKm, projection.point);
      });

      routeHitLayer.on("mouseout", clearProfileHover);

      dom.profileCanvas.addEventListener("mousemove", (event) => {
        if (!state.profileElevations.length) return;
        const rect = dom.profileCanvas.getBoundingClientRect();
        const x = clamp(event.clientX - rect.left, 0, rect.width);
        setProfileHover(profileIndexFromCanvasRatio(x / Math.max(1, rect.width)));
      });

      dom.profileCanvas.addEventListener("wheel", (event) => {
        if (!state.profileElevations.length) return;
        event.preventDefault();
        const rect = dom.profileCanvas.getBoundingClientRect();
        const x = clamp(event.clientX - rect.left, 0, rect.width);
        const hoverIndex = profileIndexFromCanvasRatio(x / Math.max(1, rect.width));
        const centerRatio = hoverIndex / Math.max(1, state.profileElevations.length - 1);
        const factor = event.deltaY < 0 ? 1.25 : 0.8;
        setProfileZoom((state.profileZoom || 1) * factor, centerRatio);
        setProfileHover(hoverIndex);
      }, { passive: false });

      dom.profileCanvas.addEventListener("mouseleave", clearProfileHover);

      dom.profileZoomInBtn.addEventListener("click", () => {
        if (state.profileElevations.length < 2) return;
        const length = Math.max(2, state.profileElevations.length);
        const centerRatio = state.profileHoverIndex >= 0 ? state.profileHoverIndex / Math.max(1, length - 1) : state.profileZoomCenter;
        setProfileZoom((state.profileZoom || 1) * 1.35, centerRatio);
      });

      dom.profileZoomOutBtn.addEventListener("click", () => {
        if (state.profileElevations.length < 2) return;
        const length = Math.max(2, state.profileElevations.length);
        const centerRatio = state.profileHoverIndex >= 0 ? state.profileHoverIndex / Math.max(1, length - 1) : state.profileZoomCenter;
        setProfileZoom((state.profileZoom || 1) / 1.35, centerRatio);
      });

      dom.profileZoomResetBtn.addEventListener("click", resetProfileZoom);
      if (dom.profileAutoPlayBtn) dom.profileAutoPlayBtn.addEventListener("click", toggleAutoPlay);
      if (dom.profileAutoStopBtn) dom.profileAutoStopBtn.addEventListener("click", () => stopAutoPlay(false));
      syncAutoPlayButtons();

      dom.menuOpenBtn.addEventListener("click", () => openMainMenu("planner"));
      dom.menuCloseBtn.addEventListener("click", closeMainMenu);
      if (dom.mobileSettingsToggle) {
        dom.mobileSettingsToggle.addEventListener("click", toggleMobileSettings);
      }
      dom.appMenu.addEventListener("click", (event) => {
        if (event.target === dom.appMenu) closeMainMenu();
      });
      dom.menuCards.forEach((card) => {
        card.addEventListener("click", () => {
          const view = card.dataset.menuView;
          if (view === "planner") closeMainMenu();
          else setMenuView(view);
        });
      });
      if (dom.menuBackToPlannerBtn) dom.menuBackToPlannerBtn.addEventListener("click", closeMainMenu);
      if (dom.menuExportGpxBtn) dom.menuExportGpxBtn.addEventListener("click", exportGpx);
      if (dom.menuCopyPngBtn) dom.menuCopyPngBtn.addEventListener("click", copyScreenshot);
      if (dom.menuDownloadPngBtn) dom.menuDownloadPngBtn.addEventListener("click", downloadScreenshot);
      window.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && dom.appMenu.classList.contains("visible")) closeMainMenu();
      });

      let activeHelpTip = null;

      function hideGlobalTip() {
        const tip = document.getElementById("globalTip");
        if (activeHelpTip) activeHelpTip.classList.remove("active-tip");
        activeHelpTip = null;
        if (!tip) return;
        tip.classList.remove("visible");
        tip.setAttribute("aria-hidden", "true");
      }

      function showGlobalTip(help) {
        const tip = document.getElementById("globalTip");
        if (!tip || !help) return;
        const text = help.getAttribute("data-tip") || help.getAttribute("title") || "";
        if (!text) return;
        if (activeHelpTip && activeHelpTip !== help) activeHelpTip.classList.remove("active-tip");
        activeHelpTip = help;
        activeHelpTip.classList.add("active-tip");
        tip.textContent = text;
        tip.classList.add("visible");
        tip.setAttribute("aria-hidden", "false");
        const rect = help.getBoundingClientRect();
        const width = Math.min(380, window.innerWidth - 24);
        let left = rect.left + rect.width / 2 - width / 2;
        left = clamp(left, 12, Math.max(12, window.innerWidth - width - 12));
        const top = rect.top > 96 ? rect.top - 12 : rect.bottom + 12;
        tip.style.width = width + "px";
        tip.style.left = left + "px";
        tip.style.top = (rect.top > 96 ? Math.max(10, top - tip.offsetHeight) : Math.min(window.innerHeight - 80, top)) + "px";
      }

      document.addEventListener("click", (event) => {
        const help = event.target && event.target.closest ? event.target.closest(".help") : null;
        const insideTip = event.target && event.target.closest ? event.target.closest("#globalTip") : null;
        if (help) {
          if (activeHelpTip === help && document.getElementById("globalTip")?.classList.contains("visible")) {
            hideGlobalTip();
          } else {
            showGlobalTip(help);
          }
          event.preventDefault();
          event.stopPropagation();
          return;
        }
        if (!insideTip) hideGlobalTip();
      });

      window.addEventListener("scroll", hideGlobalTip, true);
      window.addEventListener("resize", hideGlobalTip);

      map.on("click", async (event) => {
        if (Date.now() < state.suppressMapClickUntil) {
          if (event.originalEvent) {
            L.DomEvent.preventDefault(event.originalEvent);
            L.DomEvent.stop(event.originalEvent);
          }
          return;
        }
        if (state.drawingArea || state.areaMouseDown) return;
        if (state.manualCorrectionMode) {
          openManualCorrectionAt(event.latlng);
          return;
        }
        if (state.pickingStart) {
          state.pickingStart = false;
          dom.pickStartBtn.classList.remove("blue");
          setStart(event.latlng, "Start ustawiony kliknięciem na mapie.");
          return;
        }
        if (state.pickingFinish) {
          state.pickingFinish = false;
          dom.pickFinishBtn.classList.remove("blue");
          setFinish(event.latlng, "Meta ustawiona kliknięciem na mapie.", { keepView: true });
          openFinishRoutePopup(event.latlng);
          return;
        }
        if (isCustomMode()) {
          state.finish = null;
          if (!state.waypoints.length) state.waypoints = [state.start];
          if (state.waypoints.length === 2 && isWaypointLoop()) state.waypoints = [state.start];
          state.waypoints.push(event.latlng);
          state.lockedWaypoints.clear();
          redrawMarkers();
          drawGuide(state.waypoints, false);
          scheduleCustomRoute("Własna trasa przeliczona po klikniętych punktach.");
          return;
        }
        if (state.addingPoint) {
          state.addingPoint = false;
          dom.addPointBtn.classList.remove("blue");
          if (state.waypoints.length < 2) state.waypoints = isCustomMode() ? [state.start] : [state.start, state.start];
          state.waypoints.splice(state.waypoints.length - 1, 0, event.latlng);
          redrawMarkers();
          await routeCurrentWaypoints("Dodany punkt i trasa przeliczona.");
        }
      });

      dom.searchBtn.addEventListener("click", searchPlace);
      dom.searchInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") searchPlace();
      });
      dom.searchFinishBtn.addEventListener("click", searchFinish);
      dom.finishInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") searchFinish();
      });
      dom.gpsBtn.addEventListener("click", () => useGps(false));
      dom.pickStartBtn.addEventListener("click", () => {
        state.pickingStart = !state.pickingStart;
        state.pickingFinish = false;
        state.addingPoint = false;
        state.drawingArea = false;
        dom.pickStartBtn.classList.toggle("blue", state.pickingStart);
        dom.pickFinishBtn.classList.remove("blue");
        dom.addPointBtn.classList.remove("blue");
        dom.drawAreaBtn.classList.remove("violet");
        setStatus(state.pickingStart ? "Kliknij mapę w miejscu startu." : "Tryb ustawiania startu wyłączony.");
      });
      dom.pickFinishBtn.addEventListener("click", () => {
        state.pickingFinish = !state.pickingFinish;
        state.pickingStart = false;
        state.addingPoint = false;
        state.drawingArea = false;
        dom.pickFinishBtn.classList.toggle("blue", state.pickingFinish);
        dom.pickStartBtn.classList.remove("blue");
        dom.addPointBtn.classList.remove("blue");
        dom.drawAreaBtn.classList.remove("violet");
        if (state.pickingFinish && dom.routeMode.value !== "point") {
          dom.routeMode.value = "point";
          resetWaypointsForMode();
          syncRouteModeControls();
        }
        setStatus(state.pickingFinish ? "Kliknij mapę w miejscu mety." : "Tryb ustawiania mety wyłączony.");
      });
      dom.loopBtn.addEventListener("click", planRouteByMode);
      dom.rerouteBtn.addEventListener("click", () => routeCurrentWaypoints(isCustomMode() ? "Własna trasa przeliczona z aktualnych punktów." : (isPointMode() ? "Trasa A→B przeliczona z aktualnych punktów." : "Trasa przeliczona z aktualnych punktów.")));
      dom.addPointBtn.addEventListener("click", () => {
        state.addingPoint = !state.addingPoint;
        state.pickingStart = false;
        state.pickingFinish = false;
        state.drawingArea = false;
        dom.addPointBtn.classList.toggle("blue", state.addingPoint);
        dom.pickStartBtn.classList.remove("blue");
        dom.pickFinishBtn.classList.remove("blue");
        dom.drawAreaBtn.classList.remove("violet");
        setStatus(state.addingPoint ? "Kliknij mapę, aby dodać punkt pośredni." : "Dodawanie punktu wyłączone.");
      });
      dom.drawAreaBtn.addEventListener("click", () => {
        state.drawingArea = !state.drawingArea;
        state.addingPoint = false;
        state.pickingStart = false;
        state.pickingFinish = false;
        state.areaMouseDown = false;
        if (state.drawingArea) setMobileSettings(false);
        dom.drawAreaBtn.classList.toggle("violet", state.drawingArea);
        dom.addPointBtn.classList.remove("blue");
        dom.pickStartBtn.classList.remove("blue");
        dom.pickFinishBtn.classList.remove("blue");
        setStatus(state.drawingArea ? "Obrysuj obszar palcem na telefonie albo prawym przyciskiem myszy na komputerze." : "Rysowanie obszaru wyłączone.");
      });
      dom.clearAreaBtn.addEventListener("click", clearArea);
      dom.clearBtn.addEventListener("click", clearRoute);
      dom.randomRouteBtn.addEventListener("click", randomizeDifferentRoute);
      if (dom.reverseRouteBtn) dom.reverseRouteBtn.addEventListener("click", reverseCurrentRoute);
      if (dom.manualCorrectionBtn) dom.manualCorrectionBtn.addEventListener("click", toggleManualCorrectionMode);
      dom.gpxBtn.addEventListener("click", exportGpx);
      dom.weatherBtn.addEventListener("click", () => {
        openWeatherPanel();
        loadRouteWeather();
      });
      if (dom.weatherCloseBtn) dom.weatherCloseBtn.addEventListener("click", closeWeatherPanel);
      if (dom.weatherSliderToggleBtn) dom.weatherSliderToggleBtn.addEventListener("click", toggleWeatherSlider);
      if (dom.weatherRouteMarkersBtn) dom.weatherRouteMarkersBtn.addEventListener("click", toggleWeatherRouteMarkers);
      if (dom.weatherTimeMode) dom.weatherTimeMode.addEventListener("change", () => {
        state.weatherTimeMode = dom.weatherTimeMode.value === "fixed" ? "fixed" : "ride";
        scheduleWeatherRefreshFromControls();
      });
      if (dom.weatherTimeOffset) dom.weatherTimeOffset.addEventListener("input", () => {
        state.weatherTimeMode = "fixed";
        state.weatherHourOffset = Math.max(0, Number(dom.weatherTimeOffset.value) || 0);
        scheduleWeatherRefreshFromControls();
      });
      syncWeatherTimeControls();
      syncWeatherRouteMarkersButton();
      if (dom.legendToggleBtn) dom.legendToggleBtn.addEventListener("click", toggleLegendCollapsed);
      if (dom.weatherWidget) dom.weatherWidget.addEventListener("click", (event) => {
        if (event.target && event.target.closest && event.target.closest(".weather-widget-x")) {
          dom.weatherWidget.classList.add("hidden");
          return;
        }
        dom.weatherWidget.classList.remove("hidden");
        openWeatherPanel();
        if (!state.weatherItems.length) loadRouteWeather();
      });
      dom.importGpxBtn.addEventListener("click", () => dom.importGpxFile.click());
      if (dom.quickImportTopBtn) dom.quickImportTopBtn.addEventListener("click", () => dom.importGpxFile.click());
      dom.importGpxFile.addEventListener("change", () => importGpxFile(dom.importGpxFile.files[0]));
      if (dom.fullscreenBtn) dom.fullscreenBtn.addEventListener("click", toggleMapFullscreen);
      dom.quickFullscreenBtn.addEventListener("click", toggleMapFullscreen);
      if (dom.mapMenuToggleBtn) dom.mapMenuToggleBtn.addEventListener("click", toggleMapMenu);
      if (dom.qualityBadge) dom.qualityBadge.addEventListener("click", openRouteQualityReport);
      if (dom.topMenuToggleBtn) dom.topMenuToggleBtn.addEventListener("click", toggleTopMenu);
      if (dom.quickShopsBtn) dom.quickShopsBtn.addEventListener("click", toggleFoodShopsFromMap);
      if (dom.quickAttractionsBtn) dom.quickAttractionsBtn.addEventListener("click", toggleAttractionsFromMap);
      if (dom.quickCorrectionBtn) dom.quickCorrectionBtn.addEventListener("click", toggleManualCorrectionMode);
      dom.routeStopsBtn.addEventListener("click", loadRouteFoodShops);
      if (dom.routeAttractionsBtn) dom.routeAttractionsBtn.addEventListener("click", loadRouteAttractions);
      dom.routeReportBtn.addEventListener("click", () => openRouteReport("Kontrola trasy"));
      if (dom.tripPlanBtn) dom.tripPlanBtn.addEventListener("click", openTripPlan);
      if (dom.routeLodgingBtn) dom.routeLodgingBtn.addEventListener("click", loadRouteLodgings);
      dom.routeReportCloseBtn.addEventListener("click", () => dom.routeReportPanel.classList.remove("visible", "route-quality-modal"));
      if (dom.correctionCloseBtn) dom.correctionCloseBtn.addEventListener("click", closeManualCorrectionPanel);
      if (dom.correctionRange) dom.correctionRange.addEventListener("input", refreshPendingCorrectionRange);
      if (dom.correctionApplyBtn) dom.correctionApplyBtn.addEventListener("click", applyManualCorrection);
      if (dom.correctionRemoveBtn) dom.correctionRemoveBtn.addEventListener("click", removeNearestManualCorrection);
      if (dom.routeReportDetails) dom.routeReportDetails.addEventListener("click", (event) => {
        const button = event.target && event.target.closest ? event.target.closest("[data-jump-from]") : null;
        if (!button) return;
        jumpToRouteKmRange(Number(button.dataset.jumpFrom), Number(button.dataset.jumpTo));
      });
      dom.routeColorBtn.addEventListener("click", toggleRouteColorMode);
      [
        [dom.layerClimbsToggle, "climbs"],
        [dom.layerFatigueToggle, "fatigue"],
        [dom.layerWeatherToggle, "weather"],
        [dom.layerBreaksToggle, "breaks"],
        [dom.layerPoisToggle, "pois"],
        [dom.layerCorrectionsToggle, "corrections"]
      ].forEach(([control, key]) => {
        if (!control) return;
        control.checked = state.layerVisibility[key];
        control.addEventListener("change", () => applyLayerVisibility(key, control.checked, true));
      });
      dom.fullscreenReportBtn.addEventListener("click", () => openRouteReport("Kontrola trasy"));
      if (dom.fullscreenTripPlanBtn) dom.fullscreenTripPlanBtn.addEventListener("click", openTripPlan);
      if (dom.fullscreenLodgingBtn) dom.fullscreenLodgingBtn.addEventListener("click", loadRouteLodgings);
      if (dom.fullscreenStopsBtn) dom.fullscreenStopsBtn.addEventListener("click", loadRouteFoodShops);
      if (dom.fullscreenRouteAttractionsBtn) dom.fullscreenRouteAttractionsBtn.addEventListener("click", loadRouteAttractions);
      if (dom.fullscreenAttractionsBtn) dom.fullscreenAttractionsBtn.addEventListener("click", toggleAttractionsFromMap);
      dom.fullscreenColorBtn.addEventListener("click", toggleRouteColorMode);
      if (dom.fullscreenCorrectionBtn) dom.fullscreenCorrectionBtn.addEventListener("click", toggleManualCorrectionMode);
      dom.fullscreenCopyShotBtn.addEventListener("click", copyScreenshot);
      dom.fullscreenDownloadShotBtn.addEventListener("click", downloadScreenshot);
      if (dom.fullscreenMenuToggleBtn) dom.fullscreenMenuToggleBtn.addEventListener("click", toggleFullscreenMapMenu);
      dom.fullscreenExitBtn.addEventListener("click", toggleMapFullscreen);
      dom.copyShotBtn.addEventListener("click", copyScreenshot);
      dom.downloadShotBtn.addEventListener("click", downloadScreenshot);
      if (dom.undoPointBtn) dom.undoPointBtn.addEventListener("click", undoLastPoint);
      if (dom.breakEveryKm) {
        dom.breakEveryKm.addEventListener("input", drawPlannedBreaks);
        dom.breakEveryKm.addEventListener("change", () => {
          drawPlannedBreaks();
          const everyKm = plannedBreakDistanceKm();
          setStatus(everyKm ? "Planowane przerwy pokazane co " + everyKm.toFixed(0) + " km na linii trasy." : "Planowane przerwy ukryte.");
        });
      }
      if (dom.saveProjectBtn) dom.saveProjectBtn.addEventListener("click", saveProject);
      if (dom.loadProjectBtn && dom.loadProjectFile) dom.loadProjectBtn.addEventListener("click", () => dom.loadProjectFile.click());
      if (dom.loadProjectFile) dom.loadProjectFile.addEventListener("change", () => loadProjectFile(dom.loadProjectFile.files[0]));
      dom.routeMode.addEventListener("change", () => {
        state.routeSearchNonce += 1;
        discardCurrentRouteVisuals(true);
        syncRouteModeControls();
        if (isCustomMode()) {
          state.finish = null;
          drawGuide(state.waypoints, false);
          setStatus("Tryb Własna trasa. Start S zostaje, a każdy klik na mapie dodaje kolejny punkt i od razu przelicza trasę.", "warn");
        } else if (isPointMode()) {
          if (state.finish) drawGuide(state.waypoints, true);
          setStatus(state.finish ? "Tryb Start → Meta. Przeciągnij M, kliknij prawym w nowe miejsce albo użyj dymka przy mecie." : "Tryb Start → Meta. Ustaw M prawym kliknięciem, wyszukiwarką albo przyciskiem Meta z mapy.", "warn");
        } else {
          previewNextLoopSketch();
          setStatus("Tryb pętli. Kliknij Szukaj płaskiej pętli.");
        }
      });
      dom.routePreset.addEventListener("change", () => applyRoutePreset(dom.routePreset.value, true));
      dom.mapStyle.addEventListener("change", () => {
        switchMapLayer(dom.mapStyle.value);
        setStatus("Zmieniono podklad mapy.");
      });
      if (dom.themeStyle) dom.themeStyle.addEventListener("change", () => applyVisualTheme(dom.themeStyle.value, true));
      if (dom.showFoodShops) dom.showFoodShops.addEventListener("change", toggleFoodShops);
      if (dom.showAttractions) dom.showAttractions.addEventListener("change", toggleAttractions);
      map.on("moveend zoomend", () => {
        scheduleFoodShopRefresh();
        scheduleAttractionRefresh();
        if (state.weatherItems && state.weatherItems.length) drawWeatherDetails(state.weatherItems);
      });
      dom.hideVariantsBtn.addEventListener("click", hideVariantPanel);
      dom.showVariantsBtn.addEventListener("click", showVariantPanel);
      dom.flatWeight.addEventListener("input", syncLabels);
      dom.flatWeight.addEventListener("change", () => markRouteRulesChanged("Zmieniono wagę płaskości."));
      dom.targetKm.addEventListener("input", syncLabels);
      dom.targetKm.addEventListener("change", () => markRouteRulesChanged("Zmieniono docelowy dystans."));
      dom.lapCount.addEventListener("input", () => {
        syncLabels();
        updateMetrics(state.stats, "OSRM");
      });
      dom.lapCount.addEventListener("change", () => {
        syncLabels();
        updateMetrics(state.stats, "OSRM");
        setStatus("Zmieniono liczbę pętli. Trasa zostaje ta sama, statystyki treningu zostały przeliczone.");
      });
      dom.repeatGpx.addEventListener("change", () => {
        setStatus(dom.repeatGpx.checked ? "GPX zapisze pełny trening z powtórzeniami pętli." : "GPX zapisze tylko jedną pętlę.");
      });
      dom.avgSpeed.addEventListener("input", () => {
        syncLabels();
        updateMetrics(state.stats, "OSRM");
      });
      for (const input of [dom.riderWeight, dom.bikeWeight, dom.bikeType]) {
        if (!input) continue;
        input.addEventListener("input", () => {
          syncLabels();
          updateMetrics(state.stats, "OSRM");
        });
        input.addEventListener("change", () => {
          syncLabels();
          updateMetrics(state.stats, "OSRM");
        });
      }
      dom.attempts.addEventListener("input", syncLabels);
      dom.attempts.addEventListener("change", () => markRouteRulesChanged("Zmieniono liczbę wariantów do sprawdzenia."));
      dom.maxRadiusKm.addEventListener("input", syncLabels);
      dom.maxRadiusKm.addEventListener("change", () => markRouteRulesChanged("Zmieniono promień szukania."));
      dom.maxGrade.addEventListener("input", syncLabels);
      dom.maxGrade.addEventListener("change", () => markRouteRulesChanged("Zmieniono limit nachylenia."));
      dom.targetGrade.addEventListener("input", syncLabels);
      dom.targetGrade.addEventListener("change", () => markRouteRulesChanged(Number(dom.targetGrade.value) > 0 ? "Zmieniono cel podjazdów." : "Wyłączono wymuszanie podjazdów."));
      dom.roadStrictness.addEventListener("change", () => markRouteRulesChanged("Zmieniono karę za główne drogi."));
      for (const input of [dom.avoidNationalRoads, dom.avoidVoivodeshipRoads, dom.avoidForestAuto, dom.preferAsphalt, dom.preferBikeRoutes]) {
        input.addEventListener("change", () => markRouteRulesChanged("Preferencje dróg zmienione."));
      }
      window.addEventListener("resize", () => {
        map.invalidateSize();
        drawProfile(state.stats ? state.stats.elevations : []);
      });
      document.addEventListener("fullscreenchange", syncFullscreenButton);
      document.addEventListener("webkitfullscreenchange", syncFullscreenButton);
      document.addEventListener("msfullscreenchange", syncFullscreenButton);
      updateClock();
      window.setInterval(updateClock, 1000);
      if (dom.routeMode) dom.routeMode.value = "custom";
      syncLabels();
      syncRouteModeControls();
      syncFoodShopButtons();
      syncAttractionButtons();
      syncFullscreenButton();
      syncRouteColorButtons();
      applyAllLayerVisibility();
      restoreVisualTheme();
      restoreLegendState();
      renderRouteReport("Kontrola trasy");
      state.waypoints = isCustomMode() ? [state.start] : [state.start, state.start];
      redrawMarkers();
      drawProfile([]);
      openMainMenu("planner");
      map.whenReady(() => {
        window.setTimeout(() => {
          map.invalidateSize();
          drawProfile(state.stats ? state.stats.elevations : []);
        }, 100);
        window.setTimeout(() => useGps(true), 300);
      });
    })();






















































































































