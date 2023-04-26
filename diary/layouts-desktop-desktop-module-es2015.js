(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["layouts-desktop-desktop-module"],{

/***/ "./src/app/layouts/desktop/desktop.component.ts":
/*!******************************************************!*\
  !*** ./src/app/layouts/desktop/desktop.component.ts ***!
  \******************************************************/
/*! exports provided: DiaryDesktopComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DiaryDesktopComponent", function() { return DiaryDesktopComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");


class DiaryDesktopComponent {
}
DiaryDesktopComponent.ɵfac = function DiaryDesktopComponent_Factory(t) { return new (t || DiaryDesktopComponent)(); };
DiaryDesktopComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: DiaryDesktopComponent, selectors: [["diary-desktop"]], decls: 2, vars: 0, template: function DiaryDesktopComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "h1");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "DESKTOP");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } }, encapsulation: 2 });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](DiaryDesktopComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'diary-desktop',
                template: '<h1>DESKTOP</h1>'
            }]
    }], null, null); })();


/***/ }),

/***/ "./src/app/layouts/desktop/desktop.module.ts":
/*!***************************************************!*\
  !*** ./src/app/layouts/desktop/desktop.module.ts ***!
  \***************************************************/
/*! exports provided: DiaryDesktopModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DiaryDesktopModule", function() { return DiaryDesktopModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");
/* harmony import */ var _desktop_routing__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./desktop.routing */ "./src/app/layouts/desktop/desktop.routing.ts");
/* harmony import */ var _desktop_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./desktop.component */ "./src/app/layouts/desktop/desktop.component.ts");





class DiaryDesktopModule {
}
DiaryDesktopModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineNgModule"]({ type: DiaryDesktopModule, bootstrap: [_desktop_component__WEBPACK_IMPORTED_MODULE_3__["DiaryDesktopComponent"]] });
DiaryDesktopModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjector"]({ factory: function DiaryDesktopModule_Factory(t) { return new (t || DiaryDesktopModule)(); }, providers: [], imports: [[
            _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
            _desktop_routing__WEBPACK_IMPORTED_MODULE_2__["DiaryDesktopRoutingModule"]
        ]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsetNgModuleScope"](DiaryDesktopModule, { declarations: [_desktop_component__WEBPACK_IMPORTED_MODULE_3__["DiaryDesktopComponent"]], imports: [_angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
        _desktop_routing__WEBPACK_IMPORTED_MODULE_2__["DiaryDesktopRoutingModule"]] }); })();
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](DiaryDesktopModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"],
        args: [{
                declarations: [
                    _desktop_component__WEBPACK_IMPORTED_MODULE_3__["DiaryDesktopComponent"]
                ],
                imports: [
                    _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
                    _desktop_routing__WEBPACK_IMPORTED_MODULE_2__["DiaryDesktopRoutingModule"]
                ],
                providers: [],
                bootstrap: [_desktop_component__WEBPACK_IMPORTED_MODULE_3__["DiaryDesktopComponent"]]
            }]
    }], null, null); })();


/***/ }),

/***/ "./src/app/layouts/desktop/desktop.routing.ts":
/*!****************************************************!*\
  !*** ./src/app/layouts/desktop/desktop.routing.ts ***!
  \****************************************************/
/*! exports provided: DiaryDesktopRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DiaryDesktopRoutingModule", function() { return DiaryDesktopRoutingModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/__ivy_ngcc__/fesm2015/router.js");
/* harmony import */ var _desktop_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./desktop.component */ "./src/app/layouts/desktop/desktop.component.ts");





const routes = [
    {
        path: '',
        component: _desktop_component__WEBPACK_IMPORTED_MODULE_2__["DiaryDesktopComponent"]
    }
];
class DiaryDesktopRoutingModule {
}
DiaryDesktopRoutingModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineNgModule"]({ type: DiaryDesktopRoutingModule });
DiaryDesktopRoutingModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjector"]({ factory: function DiaryDesktopRoutingModule_Factory(t) { return new (t || DiaryDesktopRoutingModule)(); }, imports: [[_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forChild(routes)],
        _angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsetNgModuleScope"](DiaryDesktopRoutingModule, { imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]], exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]] }); })();
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](DiaryDesktopRoutingModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"],
        args: [{
                imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forChild(routes)],
                exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]]
            }]
    }], null, null); })();


/***/ })

}]);
//# sourceMappingURL=layouts-desktop-desktop-module-es2015.js.map