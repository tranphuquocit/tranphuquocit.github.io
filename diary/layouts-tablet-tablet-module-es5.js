function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["layouts-tablet-tablet-module"], {
  /***/
  "./src/app/layouts/tablet/tablet.component.ts":
  /*!****************************************************!*\
    !*** ./src/app/layouts/tablet/tablet.component.ts ***!
    \****************************************************/

  /*! exports provided: DiaryTabletComponent */

  /***/
  function srcAppLayoutsTabletTabletComponentTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "DiaryTabletComponent", function () {
      return DiaryTabletComponent;
    });
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");

    var DiaryTabletComponent = function DiaryTabletComponent() {
      _classCallCheck(this, DiaryTabletComponent);
    };

    DiaryTabletComponent.ɵfac = function DiaryTabletComponent_Factory(t) {
      return new (t || DiaryTabletComponent)();
    };

    DiaryTabletComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: DiaryTabletComponent,
      selectors: [["diary-tablet"]],
      decls: 2,
      vars: 0,
      template: function DiaryTabletComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "h1");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "TABLET");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        }
      },
      encapsulation: 2
    });
    /*@__PURE__*/

    (function () {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](DiaryTabletComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
          selector: 'diary-tablet',
          template: '<h1>TABLET</h1>'
        }]
      }], null, null);
    })();
    /***/

  },

  /***/
  "./src/app/layouts/tablet/tablet.module.ts":
  /*!*************************************************!*\
    !*** ./src/app/layouts/tablet/tablet.module.ts ***!
    \*************************************************/

  /*! exports provided: DiaryTabletModule */

  /***/
  function srcAppLayoutsTabletTabletModuleTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "DiaryTabletModule", function () {
      return DiaryTabletModule;
    });
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
    /* harmony import */


    var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! @angular/common */
    "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");
    /* harmony import */


    var _tablet_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! ./tablet.component */
    "./src/app/layouts/tablet/tablet.component.ts");
    /* harmony import */


    var _tablet_routing__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! ./tablet.routing */
    "./src/app/layouts/tablet/tablet.routing.ts");

    var DiaryTabletModule = function DiaryTabletModule() {
      _classCallCheck(this, DiaryTabletModule);
    };

    DiaryTabletModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineNgModule"]({
      type: DiaryTabletModule,
      bootstrap: [_tablet_component__WEBPACK_IMPORTED_MODULE_2__["DiaryTabletComponent"]]
    });
    DiaryTabletModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjector"]({
      factory: function DiaryTabletModule_Factory(t) {
        return new (t || DiaryTabletModule)();
      },
      providers: [],
      imports: [[_angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"], _tablet_routing__WEBPACK_IMPORTED_MODULE_3__["DiaryTabletRoutingModule"]]]
    });

    (function () {
      (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsetNgModuleScope"](DiaryTabletModule, {
        declarations: [_tablet_component__WEBPACK_IMPORTED_MODULE_2__["DiaryTabletComponent"]],
        imports: [_angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"], _tablet_routing__WEBPACK_IMPORTED_MODULE_3__["DiaryTabletRoutingModule"]]
      });
    })();
    /*@__PURE__*/


    (function () {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](DiaryTabletModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"],
        args: [{
          declarations: [_tablet_component__WEBPACK_IMPORTED_MODULE_2__["DiaryTabletComponent"]],
          imports: [_angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"], _tablet_routing__WEBPACK_IMPORTED_MODULE_3__["DiaryTabletRoutingModule"]],
          providers: [],
          bootstrap: [_tablet_component__WEBPACK_IMPORTED_MODULE_2__["DiaryTabletComponent"]]
        }]
      }], null, null);
    })();
    /***/

  },

  /***/
  "./src/app/layouts/tablet/tablet.routing.ts":
  /*!**************************************************!*\
    !*** ./src/app/layouts/tablet/tablet.routing.ts ***!
    \**************************************************/

  /*! exports provided: DiaryTabletRoutingModule */

  /***/
  function srcAppLayoutsTabletTabletRoutingTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "DiaryTabletRoutingModule", function () {
      return DiaryTabletRoutingModule;
    });
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
    /* harmony import */


    var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! @angular/router */
    "./node_modules/@angular/router/__ivy_ngcc__/fesm2015/router.js");
    /* harmony import */


    var _tablet_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! ./tablet.component */
    "./src/app/layouts/tablet/tablet.component.ts");

    var routes = [{
      path: '',
      component: _tablet_component__WEBPACK_IMPORTED_MODULE_2__["DiaryTabletComponent"]
    }];

    var DiaryTabletRoutingModule = function DiaryTabletRoutingModule() {
      _classCallCheck(this, DiaryTabletRoutingModule);
    };

    DiaryTabletRoutingModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineNgModule"]({
      type: DiaryTabletRoutingModule
    });
    DiaryTabletRoutingModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjector"]({
      factory: function DiaryTabletRoutingModule_Factory(t) {
        return new (t || DiaryTabletRoutingModule)();
      },
      imports: [[_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forChild(routes)], _angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]]
    });

    (function () {
      (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsetNgModuleScope"](DiaryTabletRoutingModule, {
        imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]],
        exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]]
      });
    })();
    /*@__PURE__*/


    (function () {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](DiaryTabletRoutingModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"],
        args: [{
          imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forChild(routes)],
          exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]]
        }]
      }], null, null);
    })();
    /***/

  }
}]);
//# sourceMappingURL=layouts-tablet-tablet-module-es5.js.map