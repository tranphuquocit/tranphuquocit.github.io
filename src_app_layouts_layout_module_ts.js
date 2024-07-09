(self["webpackChunkdhgroup"] = self["webpackChunkdhgroup"] || []).push([["src_app_layouts_layout_module_ts"],{

/***/ 5109:
/*!*************************************************************************!*\
  !*** ./src/app/layouts/components/detail-home/detail-home.component.ts ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DetailHomeComponent": () => (/* binding */ DetailHomeComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 7716);

class DetailHomeComponent {
}
DetailHomeComponent.ɵfac = function DetailHomeComponent_Factory(t) { return new (t || DetailHomeComponent)(); };
DetailHomeComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: DetailHomeComponent, selectors: [["ghgroup-detail-home"]], decls: 1, vars: 0, template: function DetailHomeComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](0, "Hello Detail Home!");
    } }, encapsulation: 2 });


/***/ }),

/***/ 4084:
/*!***********************************************************!*\
  !*** ./src/app/layouts/components/home/home.component.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HomeComponent": () => (/* binding */ HomeComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 7716);

class HomeComponent {
}
HomeComponent.ɵfac = function HomeComponent_Factory(t) { return new (t || HomeComponent)(); };
HomeComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: HomeComponent, selectors: [["ghgroup-home"]], decls: 1, vars: 0, template: function HomeComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](0, "Hello Home!");
    } }, encapsulation: 2 });


/***/ }),

/***/ 5461:
/*!*********************************************!*\
  !*** ./src/app/layouts/components/index.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HomeComponent": () => (/* reexport safe */ _home_home_component__WEBPACK_IMPORTED_MODULE_0__.HomeComponent),
/* harmony export */   "DetailHomeComponent": () => (/* reexport safe */ _detail_home_detail_home_component__WEBPACK_IMPORTED_MODULE_1__.DetailHomeComponent)
/* harmony export */ });
/* harmony import */ var _home_home_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./home/home.component */ 4084);
/* harmony import */ var _detail_home_detail_home_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./detail-home/detail-home.component */ 5109);




/***/ }),

/***/ 5418:
/*!**************************************************!*\
  !*** ./src/app/layouts/layout-routing.module.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LayoutRoutingModule": () => (/* binding */ LayoutRoutingModule)
/* harmony export */ });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ 9895);
/* harmony import */ var _layout_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./layout.component */ 6774);
/* harmony import */ var _components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components */ 5461);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 7716);





const routes = [
    {
        path: '',
        component: _layout_component__WEBPACK_IMPORTED_MODULE_0__.LayoutComponent,
        children: [
            { path: '', component: _components__WEBPACK_IMPORTED_MODULE_1__.HomeComponent },
            { path: 'detail/:id', component: _components__WEBPACK_IMPORTED_MODULE_1__.DetailHomeComponent },
        ]
    }
];
class LayoutRoutingModule {
}
LayoutRoutingModule.ɵfac = function LayoutRoutingModule_Factory(t) { return new (t || LayoutRoutingModule)(); };
LayoutRoutingModule.ɵmod = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineNgModule"]({ type: LayoutRoutingModule });
LayoutRoutingModule.ɵinj = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjector"]({ imports: [[_angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterModule.forChild(routes)], _angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterModule] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵsetNgModuleScope"](LayoutRoutingModule, { imports: [_angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterModule], exports: [_angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterModule] }); })();


/***/ }),

/***/ 6774:
/*!*********************************************!*\
  !*** ./src/app/layouts/layout.component.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LayoutComponent": () => (/* binding */ LayoutComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 7716);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ 9895);


class LayoutComponent {
}
LayoutComponent.ɵfac = function LayoutComponent_Factory(t) { return new (t || LayoutComponent)(); };
LayoutComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: LayoutComponent, selectors: [["layout-root"]], decls: 1, vars: 0, template: function LayoutComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "router-outlet");
    } }, directives: [_angular_router__WEBPACK_IMPORTED_MODULE_1__.RouterOutlet], encapsulation: 2 });


/***/ }),

/***/ 9280:
/*!******************************************!*\
  !*** ./src/app/layouts/layout.module.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LayoutModule": () => (/* binding */ LayoutModule)
/* harmony export */ });
/* harmony import */ var _layout_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./layout.component */ 6774);
/* harmony import */ var _layout_routing_module__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./layout-routing.module */ 5418);
/* harmony import */ var _components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components */ 5461);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 7716);




const COMPONENT = [
    _components__WEBPACK_IMPORTED_MODULE_2__.HomeComponent
];
class LayoutModule {
}
LayoutModule.ɵfac = function LayoutModule_Factory(t) { return new (t || LayoutModule)(); };
LayoutModule.ɵmod = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineNgModule"]({ type: LayoutModule, bootstrap: [_layout_component__WEBPACK_IMPORTED_MODULE_0__.LayoutComponent] });
LayoutModule.ɵinj = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineInjector"]({ providers: [], imports: [[
            _layout_routing_module__WEBPACK_IMPORTED_MODULE_1__.LayoutRoutingModule
        ]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵsetNgModuleScope"](LayoutModule, { declarations: [_layout_component__WEBPACK_IMPORTED_MODULE_0__.LayoutComponent, _components__WEBPACK_IMPORTED_MODULE_2__.HomeComponent], imports: [_layout_routing_module__WEBPACK_IMPORTED_MODULE_1__.LayoutRoutingModule] }); })();


/***/ })

}]);
//# sourceMappingURL=src_app_layouts_layout_module_ts.js.map