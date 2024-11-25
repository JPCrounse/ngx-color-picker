import { Directive, Input, Output, EventEmitter, HostListener, Injector } from '@angular/core';
import { ColorPickerComponent } from './color-picker.component';
import * as i0 from "@angular/core";
import * as i1 from "./color-picker.service";
// Caretaker note: we have still left the `typeof` condition in order to avoid
// creating a breaking change for projects that still use the View Engine.
// The `ngDevMode` is always available when Ivy is enabled.
// This will be evaluated during compilation into `const NG_DEV_MODE = false`,
// thus Terser will be able to tree-shake `console.warn` calls.
const NG_DEV_MODE = typeof ngDevMode === 'undefined' || !!ngDevMode;
export class ColorPickerDirective {
    injector;
    cfr;
    appRef;
    vcRef;
    elRef;
    _service;
    dialog;
    dialogCreated = false;
    ignoreChanges = false;
    cmpRef;
    viewAttachedToAppRef = false;
    colorPicker;
    cpWidth = '230px';
    cpHeight = 'auto';
    cpToggle = false;
    cpDisabled = false;
    cpIgnoredElements = [];
    cpFallbackColor = '';
    cpColorMode = 'color';
    cpCmykEnabled = false;
    cpOutputFormat = 'auto';
    cpAlphaChannel = 'enabled';
    cpDisableInput = false;
    cpDialogDisplay = 'popup';
    cpSaveClickOutside = true;
    cpCloseClickOutside = true;
    cpUseRootViewContainer = false;
    cpPosition = 'auto';
    cpPositionOffset = '0%';
    cpPositionRelativeToArrow = false;
    cpOKButton = false;
    cpOKButtonText = 'OK';
    cpOKButtonClass = 'cp-ok-button-class';
    cpCancelButton = false;
    cpCancelButtonText = 'Cancel';
    cpCancelButtonClass = 'cp-cancel-button-class';
    cpEyeDropper = false;
    cpPresetLabel = 'Preset colors';
    cpPresetColors;
    cpPresetColorsClass = 'cp-preset-colors-class';
    cpMaxPresetColorsLength = 6;
    cpPresetEmptyMessage = 'No colors added';
    cpPresetEmptyMessageClass = 'preset-empty-message';
    cpAddColorButton = false;
    cpAddColorButtonText = 'Add color';
    cpAddColorButtonClass = 'cp-add-color-button-class';
    cpRemoveColorButtonClass = 'cp-remove-color-button-class';
    cpArrowPosition = 0;
    cpExtraTemplate;
    cpInputChange = new EventEmitter(true);
    cpToggleChange = new EventEmitter(true);
    cpSliderChange = new EventEmitter(true);
    cpSliderDragEnd = new EventEmitter(true);
    cpSliderDragStart = new EventEmitter(true);
    colorPickerOpen = new EventEmitter(true);
    colorPickerClose = new EventEmitter(true);
    colorPickerCancel = new EventEmitter(true);
    colorPickerSelect = new EventEmitter(true);
    colorPickerChange = new EventEmitter(false);
    cpCmykColorChange = new EventEmitter(true);
    cpPresetColorsChange = new EventEmitter(true);
    handleClick() {
        this.inputFocus();
    }
    handleFocus() {
        this.inputFocus();
    }
    handleInput(event) {
        this.inputChange(event);
    }
    constructor(injector, cfr, appRef, vcRef, elRef, _service) {
        this.injector = injector;
        this.cfr = cfr;
        this.appRef = appRef;
        this.vcRef = vcRef;
        this.elRef = elRef;
        this._service = _service;
    }
    ngOnDestroy() {
        if (this.cmpRef != null) {
            if (this.viewAttachedToAppRef) {
                this.appRef.detachView(this.cmpRef.hostView);
            }
            this.cmpRef.destroy();
            this.cmpRef = null;
            this.dialog = null;
        }
    }
    ngOnChanges(changes) {
        if (changes.cpToggle && !this.cpDisabled) {
            if (changes.cpToggle.currentValue) {
                this.openDialog();
            }
            else if (!changes.cpToggle.currentValue) {
                this.closeDialog();
            }
        }
        if (changes.colorPicker) {
            if (this.dialog && !this.ignoreChanges) {
                if (this.cpDialogDisplay === 'inline') {
                    this.dialog.setInitialColor(changes.colorPicker.currentValue);
                }
                this.dialog.setColorFromString(changes.colorPicker.currentValue, false);
                if (this.cpUseRootViewContainer && this.cpDialogDisplay !== 'inline') {
                    this.cmpRef.changeDetectorRef.detectChanges();
                }
            }
            this.ignoreChanges = false;
        }
        if (changes.cpPresetLabel || changes.cpPresetColors) {
            if (this.dialog) {
                this.dialog.setPresetConfig(this.cpPresetLabel, this.cpPresetColors);
            }
        }
    }
    openDialog() {
        if (!this.dialogCreated) {
            let vcRef = this.vcRef;
            this.dialogCreated = true;
            this.viewAttachedToAppRef = false;
            if (this.cpUseRootViewContainer && this.cpDialogDisplay !== 'inline') {
                const classOfRootComponent = this.appRef.componentTypes[0];
                const appInstance = this.injector.get(classOfRootComponent, Injector.NULL);
                if (appInstance !== Injector.NULL) {
                    vcRef = appInstance.vcRef || appInstance.viewContainerRef || this.vcRef;
                    if (NG_DEV_MODE && vcRef === this.vcRef) {
                        console.warn('You are using cpUseRootViewContainer, ' +
                            'but the root component is not exposing viewContainerRef!' +
                            'Please expose it by adding \'public vcRef: ViewContainerRef\' to the constructor.');
                    }
                }
                else {
                    this.viewAttachedToAppRef = true;
                }
            }
            const compFactory = this.cfr.resolveComponentFactory(ColorPickerComponent);
            if (this.viewAttachedToAppRef) {
                this.cmpRef = compFactory.create(this.injector);
                this.appRef.attachView(this.cmpRef.hostView);
                document.body.appendChild(this.cmpRef.hostView.rootNodes[0]);
            }
            else {
                const injector = Injector.create({
                    providers: [],
                    // We shouldn't use `vcRef.parentInjector` since it's been deprecated long time ago and might be removed
                    // in newer Angular versions: https://github.com/angular/angular/pull/25174.
                    parent: vcRef.injector,
                });
                this.cmpRef = vcRef.createComponent(compFactory, 0, injector, []);
            }
            this.cmpRef.instance.setupDialog(this, this.elRef, this.colorPicker, this.cpWidth, this.cpHeight, this.cpDialogDisplay, this.cpFallbackColor, this.cpColorMode, this.cpCmykEnabled, this.cpAlphaChannel, this.cpOutputFormat, this.cpDisableInput, this.cpIgnoredElements, this.cpSaveClickOutside, this.cpCloseClickOutside, this.cpUseRootViewContainer, this.cpPosition, this.cpPositionOffset, this.cpPositionRelativeToArrow, this.cpPresetLabel, this.cpPresetColors, this.cpPresetColorsClass, this.cpMaxPresetColorsLength, this.cpPresetEmptyMessage, this.cpPresetEmptyMessageClass, this.cpOKButton, this.cpOKButtonClass, this.cpOKButtonText, this.cpCancelButton, this.cpCancelButtonClass, this.cpCancelButtonText, this.cpAddColorButton, this.cpAddColorButtonClass, this.cpAddColorButtonText, this.cpRemoveColorButtonClass, this.cpEyeDropper, this.elRef, this.cpExtraTemplate);
            this.dialog = this.cmpRef.instance;
            if (this.vcRef !== vcRef) {
                this.cmpRef.changeDetectorRef.detectChanges();
            }
        }
        else if (this.dialog) {
            // Update properties.
            this.cmpRef.instance.cpAlphaChannel = this.cpAlphaChannel;
            // Open dialog.
            this.dialog.openDialog(this.colorPicker);
        }
    }
    closeDialog() {
        if (this.dialog && this.cpDialogDisplay === 'popup') {
            this.dialog.closeDialog();
        }
    }
    cmykChanged(value) {
        this.cpCmykColorChange.emit(value);
    }
    stateChanged(state) {
        this.cpToggleChange.emit(state);
        if (state) {
            this.colorPickerOpen.emit(this.colorPicker);
        }
        else {
            this.colorPickerClose.emit(this.colorPicker);
        }
    }
    colorChanged(value, ignore = true) {
        this.ignoreChanges = ignore;
        this.colorPickerChange.emit(value);
    }
    colorSelected(value) {
        this.colorPickerSelect.emit(value);
    }
    colorCanceled() {
        this.colorPickerCancel.emit();
    }
    inputFocus() {
        const element = this.elRef.nativeElement;
        const ignored = this.cpIgnoredElements.filter((item) => item === element);
        if (!this.cpDisabled && !ignored.length) {
            if (typeof document !== 'undefined' && element === document.activeElement) {
                this.openDialog();
            }
            else if (!this.dialog || !this.dialog.show) {
                this.openDialog();
            }
            else {
                this.closeDialog();
            }
        }
    }
    inputChange(event) {
        if (this.dialog) {
            this.dialog.setColorFromString(event.target.value, true);
        }
        else {
            this.colorPicker = event.target.value;
            this.colorPickerChange.emit(this.colorPicker);
        }
    }
    inputChanged(event) {
        this.cpInputChange.emit(event);
    }
    sliderChanged(event) {
        this.cpSliderChange.emit(event);
    }
    sliderDragEnd(event) {
        this.cpSliderDragEnd.emit(event);
    }
    sliderDragStart(event) {
        this.cpSliderDragStart.emit(event);
    }
    presetColorsChanged(value) {
        this.cpPresetColorsChange.emit(value);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.11", ngImport: i0, type: ColorPickerDirective, deps: [{ token: i0.Injector }, { token: i0.ComponentFactoryResolver }, { token: i0.ApplicationRef }, { token: i0.ViewContainerRef }, { token: i0.ElementRef }, { token: i1.ColorPickerService }], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.3.11", type: ColorPickerDirective, selector: "[colorPicker]", inputs: { colorPicker: "colorPicker", cpWidth: "cpWidth", cpHeight: "cpHeight", cpToggle: "cpToggle", cpDisabled: "cpDisabled", cpIgnoredElements: "cpIgnoredElements", cpFallbackColor: "cpFallbackColor", cpColorMode: "cpColorMode", cpCmykEnabled: "cpCmykEnabled", cpOutputFormat: "cpOutputFormat", cpAlphaChannel: "cpAlphaChannel", cpDisableInput: "cpDisableInput", cpDialogDisplay: "cpDialogDisplay", cpSaveClickOutside: "cpSaveClickOutside", cpCloseClickOutside: "cpCloseClickOutside", cpUseRootViewContainer: "cpUseRootViewContainer", cpPosition: "cpPosition", cpPositionOffset: "cpPositionOffset", cpPositionRelativeToArrow: "cpPositionRelativeToArrow", cpOKButton: "cpOKButton", cpOKButtonText: "cpOKButtonText", cpOKButtonClass: "cpOKButtonClass", cpCancelButton: "cpCancelButton", cpCancelButtonText: "cpCancelButtonText", cpCancelButtonClass: "cpCancelButtonClass", cpEyeDropper: "cpEyeDropper", cpPresetLabel: "cpPresetLabel", cpPresetColors: "cpPresetColors", cpPresetColorsClass: "cpPresetColorsClass", cpMaxPresetColorsLength: "cpMaxPresetColorsLength", cpPresetEmptyMessage: "cpPresetEmptyMessage", cpPresetEmptyMessageClass: "cpPresetEmptyMessageClass", cpAddColorButton: "cpAddColorButton", cpAddColorButtonText: "cpAddColorButtonText", cpAddColorButtonClass: "cpAddColorButtonClass", cpRemoveColorButtonClass: "cpRemoveColorButtonClass", cpArrowPosition: "cpArrowPosition", cpExtraTemplate: "cpExtraTemplate" }, outputs: { cpInputChange: "cpInputChange", cpToggleChange: "cpToggleChange", cpSliderChange: "cpSliderChange", cpSliderDragEnd: "cpSliderDragEnd", cpSliderDragStart: "cpSliderDragStart", colorPickerOpen: "colorPickerOpen", colorPickerClose: "colorPickerClose", colorPickerCancel: "colorPickerCancel", colorPickerSelect: "colorPickerSelect", colorPickerChange: "colorPickerChange", cpCmykColorChange: "cpCmykColorChange", cpPresetColorsChange: "cpPresetColorsChange" }, host: { listeners: { "click": "handleClick()", "focus": "handleFocus()", "input": "handleInput($event)" } }, exportAs: ["ngxColorPicker"], usesOnChanges: true, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.11", ngImport: i0, type: ColorPickerDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[colorPicker]',
                    exportAs: 'ngxColorPicker'
                }]
        }], ctorParameters: () => [{ type: i0.Injector }, { type: i0.ComponentFactoryResolver }, { type: i0.ApplicationRef }, { type: i0.ViewContainerRef }, { type: i0.ElementRef }, { type: i1.ColorPickerService }], propDecorators: { colorPicker: [{
                type: Input
            }], cpWidth: [{
                type: Input
            }], cpHeight: [{
                type: Input
            }], cpToggle: [{
                type: Input
            }], cpDisabled: [{
                type: Input
            }], cpIgnoredElements: [{
                type: Input
            }], cpFallbackColor: [{
                type: Input
            }], cpColorMode: [{
                type: Input
            }], cpCmykEnabled: [{
                type: Input
            }], cpOutputFormat: [{
                type: Input
            }], cpAlphaChannel: [{
                type: Input
            }], cpDisableInput: [{
                type: Input
            }], cpDialogDisplay: [{
                type: Input
            }], cpSaveClickOutside: [{
                type: Input
            }], cpCloseClickOutside: [{
                type: Input
            }], cpUseRootViewContainer: [{
                type: Input
            }], cpPosition: [{
                type: Input
            }], cpPositionOffset: [{
                type: Input
            }], cpPositionRelativeToArrow: [{
                type: Input
            }], cpOKButton: [{
                type: Input
            }], cpOKButtonText: [{
                type: Input
            }], cpOKButtonClass: [{
                type: Input
            }], cpCancelButton: [{
                type: Input
            }], cpCancelButtonText: [{
                type: Input
            }], cpCancelButtonClass: [{
                type: Input
            }], cpEyeDropper: [{
                type: Input
            }], cpPresetLabel: [{
                type: Input
            }], cpPresetColors: [{
                type: Input
            }], cpPresetColorsClass: [{
                type: Input
            }], cpMaxPresetColorsLength: [{
                type: Input
            }], cpPresetEmptyMessage: [{
                type: Input
            }], cpPresetEmptyMessageClass: [{
                type: Input
            }], cpAddColorButton: [{
                type: Input
            }], cpAddColorButtonText: [{
                type: Input
            }], cpAddColorButtonClass: [{
                type: Input
            }], cpRemoveColorButtonClass: [{
                type: Input
            }], cpArrowPosition: [{
                type: Input
            }], cpExtraTemplate: [{
                type: Input
            }], cpInputChange: [{
                type: Output
            }], cpToggleChange: [{
                type: Output
            }], cpSliderChange: [{
                type: Output
            }], cpSliderDragEnd: [{
                type: Output
            }], cpSliderDragStart: [{
                type: Output
            }], colorPickerOpen: [{
                type: Output
            }], colorPickerClose: [{
                type: Output
            }], colorPickerCancel: [{
                type: Output
            }], colorPickerSelect: [{
                type: Output
            }], colorPickerChange: [{
                type: Output
            }], cpCmykColorChange: [{
                type: Output
            }], cpPresetColorsChange: [{
                type: Output
            }], handleClick: [{
                type: HostListener,
                args: ['click']
            }], handleFocus: [{
                type: HostListener,
                args: ['focus']
            }], handleInput: [{
                type: HostListener,
                args: ['input', ['$event']]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3ItcGlja2VyLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2xpYi9zcmMvbGliL2NvbG9yLXBpY2tlci5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBd0IsS0FBSyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQ25FLFlBQVksRUFDWixRQUFRLEVBQTBELE1BQU0sZUFBZSxDQUFDO0FBRzFGLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLDBCQUEwQixDQUFDOzs7QUFJaEUsOEVBQThFO0FBQzlFLDBFQUEwRTtBQUMxRSwyREFBMkQ7QUFDM0QsOEVBQThFO0FBQzlFLCtEQUErRDtBQUMvRCxNQUFNLFdBQVcsR0FBRyxPQUFPLFNBQVMsS0FBSyxXQUFXLElBQUksQ0FBQyxDQUFDLFNBQVMsQ0FBQztBQU1wRSxNQUFNLE9BQU8sb0JBQW9CO0lBbUdYO0lBQTRCO0lBQ3RDO0lBQWdDO0lBQWlDO0lBQ2pFO0lBcEdGLE1BQU0sQ0FBTTtJQUVaLGFBQWEsR0FBWSxLQUFLLENBQUM7SUFDL0IsYUFBYSxHQUFZLEtBQUssQ0FBQztJQUUvQixNQUFNLENBQXFDO0lBQzNDLG9CQUFvQixHQUFZLEtBQUssQ0FBQztJQUVyQyxXQUFXLENBQVM7SUFFcEIsT0FBTyxHQUFXLE9BQU8sQ0FBQztJQUMxQixRQUFRLEdBQVcsTUFBTSxDQUFDO0lBRTFCLFFBQVEsR0FBWSxLQUFLLENBQUM7SUFDMUIsVUFBVSxHQUFZLEtBQUssQ0FBQztJQUU1QixpQkFBaUIsR0FBUSxFQUFFLENBQUM7SUFFNUIsZUFBZSxHQUFXLEVBQUUsQ0FBQztJQUU3QixXQUFXLEdBQWMsT0FBTyxDQUFDO0lBRWpDLGFBQWEsR0FBWSxLQUFLLENBQUM7SUFFL0IsY0FBYyxHQUFpQixNQUFNLENBQUM7SUFDdEMsY0FBYyxHQUFpQixTQUFTLENBQUM7SUFFekMsY0FBYyxHQUFZLEtB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RSxDQUFDLFFBQVEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgT25DaGFuZ2VzLCBPbkRlc3Ryb3ksIElucHV0LCBPdXRwdXQsIEV2ZW50RW1pdHRlcixcclxuICBIb3N0TGlzdGVuZXIsIEFwcGxpY2F0aW9uUmVmLCBDb21wb25lbnRSZWYsIEVsZW1lbnRSZWYsIFZpZXdDb250YWluZXJSZWYsXHJcbiAgSW5qZWN0b3IsIENvbXBvbmVudEZhY3RvcnlSZXNvbHZlciwgRW1iZWRkZWRWaWV3UmVmLCBUZW1wbGF0ZVJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuaW1wb3J0IHsgQ29sb3JQaWNrZXJTZXJ2aWNlIH0gZnJvbSAnLi9jb2xvci1waWNrZXIuc2VydmljZSc7XHJcbmltcG9ydCB7IENvbG9yUGlja2VyQ29tcG9uZW50IH0gZnJvbSAnLi9jb2xvci1waWNrZXIuY29tcG9uZW50JztcclxuXHJcbmltcG9ydCB7IEFscGhhQ2hhbm5lbCwgQ29sb3JNb2RlLCBPdXRwdXRGb3JtYXQgfSBmcm9tICcuL2hlbHBlcnMnO1xyXG5cclxuLy8gQ2FyZXRha2VyIG5vdGU6IHdlIGhhdmUgc3RpbGwgbGVmdCB0aGUgYHR5cGVvZmAgY29uZGl0aW9uIGluIG9yZGVyIHRvIGF2b2lkXHJcbi8vIGNyZWF0aW5nIGEgYnJlYWtpbmcgY2hhbmdlIGZvciBwcm9qZWN0cyB0aGF0IHN0aWxsIHVzZSB0aGUgVmlldyBFbmdpbmUuXHJcbi8vIFRoZSBgbmdEZXZNb2RlYCBpcyBhbHdheXMgYXZhaWxhYmxlIHdoZW4gSXZ5IGlzIGVuYWJsZWQuXHJcbi8vIFRoaXMgd2lsbCBiZSBldmFsdWF0ZWQgZHVyaW5nIGNvbXBpbGF0aW9uIGludG8gYGNvbnN0IE5HX0RFVl9NT0RFID0gZmFsc2VgLFxyXG4vLyB0aHVzIFRlcnNlciB3aWxsIGJlIGFibGUgdG8gdHJlZS1zaGFrZSBgY29uc29sZS53YXJuYCBjYWxscy5cclxuY29uc3QgTkdfREVWX01PREUgPSB0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCAhIW5nRGV2TW9kZTtcclxuXHJcbkBEaXJlY3RpdmUoe1xyXG4gIHNlbGVjdG9yOiAnW2NvbG9yUGlja2VyXScsXHJcbiAgZXhwb3J0QXM6ICduZ3hDb2xvclBpY2tlcidcclxufSlcclxuZXhwb3J0IGNsYXNzIENvbG9yUGlja2VyRGlyZWN0aXZlIGltcGxlbWVudHMgT25DaGFuZ2VzLCBPbkRlc3Ryb3kge1xyXG4gIHByaXZhdGUgZGlhbG9nOiBhbnk7XHJcblxyXG4gIHByaXZhdGUgZGlhbG9nQ3JlYXRlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIHByaXZhdGUgaWdub3JlQ2hhbmdlczogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICBwcml2YXRlIGNtcFJlZjogQ29tcG9uZW50UmVmPENvbG9yUGlja2VyQ29tcG9uZW50PjtcclxuICBwcml2YXRlIHZpZXdBdHRhY2hlZFRvQXBwUmVmOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gIEBJbnB1dCgpIGNvbG9yUGlja2VyOiBzdHJpbmc7XHJcblxyXG4gIEBJbnB1dCgpIGNwV2lkdGg6IHN0cmluZyA9ICcyMzBweCc7XHJcbiAgQElucHV0KCkgY3BIZWlnaHQ6IHN0cmluZyA9ICdhdXRvJztcclxuXHJcbiAgQElucHV0KCkgY3BUb2dnbGU6IGJvb2xlYW4gPSBmYWxzZTtcclxuICBASW5wdXQoKSBjcERpc2FibGVkOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gIEBJbnB1dCgpIGNwSWdub3JlZEVsZW1lbnRzOiBhbnkgPSBbXTtcclxuXHJcbiAgQElucHV0KCkgY3BGYWxsYmFja0NvbG9yOiBzdHJpbmcgPSAnJztcclxuXHJcbiAgQElucHV0KCkgY3BDb2xvck1vZGU6IENvbG9yTW9kZSA9ICdjb2xvcic7XHJcblxyXG4gIEBJbnB1dCgpIGNwQ215a0VuYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgQElucHV0KCkgY3BPdXRwdXRGb3JtYXQ6IE91dHB1dEZvcm1hdCA9ICdhdXRvJztcclxuICBASW5wdXQoKSBjcEFscGhhQ2hhbm5lbDogQWxwaGFDaGFubmVsID0gJ2VuYWJsZWQnO1xyXG5cclxuICBASW5wdXQoKSBjcERpc2FibGVJbnB1dDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICBASW5wdXQoKSBjcERpYWxvZ0Rpc3BsYXk6IHN0cmluZyA9ICdwb3B1cCc7XHJcblxyXG4gIEBJbnB1dCgpIGNwU2F2ZUNsaWNrT3V0c2lkZTogYm9vbGVhbiA9IHRydWU7XHJcbiAgQElucHV0KCkgY3BDbG9zZUNsaWNrT3V0c2lkZTogYm9vbGVhbiA9IHRydWU7XHJcblxyXG4gIEBJbnB1dCgpIGNwVXNlUm9vdFZpZXdDb250YWluZXI6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgQElucHV0KCkgY3BQb3NpdGlvbjogc3RyaW5nID0gJ2F1dG8nO1xyXG4gIEBJbnB1dCgpIGNwUG9zaXRpb25PZmZzZXQ6IHN0cmluZyA9ICcwJSc7XHJcbiAgQElucHV0KCkgY3BQb3NpdGlvblJlbGF0aXZlVG9BcnJvdzogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICBASW5wdXQoKSBjcE9LQnV0dG9uOiBib29sZWFuID0gZmFsc2U7XHJcbiAgQElucHV0KCkgY3BPS0J1dHRvblRleHQ6IHN0cmluZyA9ICdPSyc7XHJcbiAgQElucHV0KCkgY3BPS0J1dHRvbkNsYXNzOiBzdHJpbmcgPSAnY3Atb2stYnV0dG9uLWNsYXNzJztcclxuXHJcbiAgQElucHV0KCkgY3BDYW5jZWxCdXR0b246IGJvb2xlYW4gPSBmYWxzZTtcclxuICBASW5wdXQoKSBjcENhbmNlbEJ1dHRvblRleHQ6IHN0cmluZyA9ICdDYW5jZWwnO1xyXG4gIEBJbnB1dCgpIGNwQ2FuY2VsQnV0dG9uQ2xhc3M6IHN0cmluZyA9ICdjcC1jYW5jZWwtYnV0dG9uLWNsYXNzJztcclxuXHJcbiAgQElucHV0KCkgY3BFeWVEcm9wcGVyOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gIEBJbnB1dCgpIGNwUHJlc2V0TGFiZWw6IHN0cmluZyA9ICdQcmVzZXQgY29sb3JzJztcclxuICBASW5wdXQoKSBjcFByZXNldENvbG9yczogc3RyaW5nW107XHJcbiAgQElucHV0KCkgY3BQcmVzZXRDb2xvcnNDbGFzczogc3RyaW5nID0gJ2NwLXByZXNldC1jb2xvcnMtY2xhc3MnO1xyXG4gIEBJbnB1dCgpIGNwTWF4UHJlc2V0Q29sb3JzTGVuZ3RoOiBudW1iZXIgPSA2O1xyXG5cclxuICBASW5wdXQoKSBjcFByZXNldEVtcHR5TWVzc2FnZTogc3RyaW5nID0gJ05vIGNvbG9ycyBhZGRlZCc7XHJcbiAgQElucHV0KCkgY3BQcmVzZXRFbXB0eU1lc3NhZ2VDbGFzczogc3RyaW5nID0gJ3ByZXNldC1lbXB0eS1tZXNzYWdlJztcclxuXHJcbiAgQElucHV0KCkgY3BBZGRDb2xvckJ1dHRvbjogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIEBJbnB1dCgpIGNwQWRkQ29sb3JCdXR0b25UZXh0OiBzdHJpbmcgPSAnQWRkIGNvbG9yJztcclxuICBASW5wdXQoKSBjcEFkZENvbG9yQnV0dG9uQ2xhc3M6IHN0cmluZyA9ICdjcC1hZGQtY29sb3ItYnV0dG9uLWNsYXNzJztcclxuXHJcbiAgQElucHV0KCkgY3BSZW1vdmVDb2xvckJ1dHRvbkNsYXNzOiBzdHJpbmcgPSAnY3AtcmVtb3ZlLWNvbG9yLWJ1dHRvbi1jbGFzcyc7XHJcbiAgQElucHV0KCkgY3BBcnJvd1Bvc2l0aW9uOiBudW1iZXIgPSAwO1xyXG5cclxuICBASW5wdXQoKSBjcEV4dHJhVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XHJcblxyXG4gIEBPdXRwdXQoKSBjcElucHV0Q2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjx7aW5wdXQ6IHN0cmluZywgdmFsdWU6IG51bWJlciB8IHN0cmluZywgY29sb3I6IHN0cmluZ30+KHRydWUpO1xyXG5cclxuICBAT3V0cHV0KCkgY3BUb2dnbGVDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KHRydWUpO1xyXG5cclxuICBAT3V0cHV0KCkgY3BTbGlkZXJDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPHtzbGlkZXI6IHN0cmluZywgdmFsdWU6IHN0cmluZyB8IG51bWJlciwgY29sb3I6IHN0cmluZ30+KHRydWUpO1xyXG4gIEBPdXRwdXQoKSBjcFNsaWRlckRyYWdFbmQgPSBuZXcgRXZlbnRFbWl0dGVyPHtzbGlkZXI6IHN0cmluZywgY29sb3I6IHN0cmluZ30+KHRydWUpO1xyXG4gIEBPdXRwdXQoKSBjcFNsaWRlckRyYWdTdGFydCA9IG5ldyBFdmVudEVtaXR0ZXI8e3NsaWRlcjogc3RyaW5nLCBjb2xvcjogc3RyaW5nfT4odHJ1ZSk7XHJcblxyXG4gIEBPdXRwdXQoKSBjb2xvclBpY2tlck9wZW4gPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZz4odHJ1ZSk7XHJcbiAgQE91dHB1dCgpIGNvbG9yUGlja2VyQ2xvc2UgPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZz4odHJ1ZSk7XHJcblxyXG4gIEBPdXRwdXQoKSBjb2xvclBpY2tlckNhbmNlbCA9IG5ldyBFdmVudEVtaXR0ZXI8c3RyaW5nPih0cnVlKTtcclxuICBAT3V0cHV0KCkgY29sb3JQaWNrZXJTZWxlY3QgPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZz4odHJ1ZSk7XHJcbiAgQE91dHB1dCgpIGNvbG9yUGlja2VyQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxzdHJpbmc+KGZhbHNlKTtcclxuXHJcbiAgQE91dHB1dCgpIGNwQ215a0NvbG9yQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxzdHJpbmc+KHRydWUpO1xyXG5cclxuICBAT3V0cHV0KCkgY3BQcmVzZXRDb2xvcnNDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4odHJ1ZSk7XHJcblxyXG4gIEBIb3N0TGlzdGVuZXIoJ2NsaWNrJykgaGFuZGxlQ2xpY2soKTogdm9pZCB7XHJcbiAgICB0aGlzLmlucHV0Rm9jdXMoKTtcclxuICB9XHJcblxyXG4gIEBIb3N0TGlzdGVuZXIoJ2ZvY3VzJykgaGFuZGxlRm9jdXMoKTogdm9pZCB7XHJcbiAgICB0aGlzLmlucHV0Rm9jdXMoKTtcclxuICB9XHJcblxyXG4gIEBIb3N0TGlzdGVuZXIoJ2lucHV0JywgWyckZXZlbnQnXSkgaGFuZGxlSW5wdXQoZXZlbnQ6IGFueSk6IHZvaWQge1xyXG4gICAgdGhpcy5pbnB1dENoYW5nZShldmVudCk7XHJcbiAgfVxyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGluamVjdG9yOiBJbmplY3RvciwgcHJpdmF0ZSBjZnI6IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcclxuICAgIHByaXZhdGUgYXBwUmVmOiBBcHBsaWNhdGlvblJlZiwgcHJpdmF0ZSB2Y1JlZjogVmlld0NvbnRhaW5lclJlZiwgcHJpdmF0ZSBlbFJlZjogRWxlbWVudFJlZixcclxuICAgIHByaXZhdGUgX3NlcnZpY2U6IENvbG9yUGlja2VyU2VydmljZSkge31cclxuXHJcbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5jbXBSZWYgIT0gbnVsbCkge1xyXG4gICAgICBpZiAodGhpcy52aWV3QXR0YWNoZWRUb0FwcFJlZikge1xyXG4gICAgICAgIHRoaXMuYXBwUmVmLmRldGFjaFZpZXcodGhpcy5jbXBSZWYuaG9zdFZpZXcpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLmNtcFJlZi5kZXN0cm95KCk7XHJcblxyXG4gICAgICB0aGlzLmNtcFJlZiA9IG51bGw7XHJcbiAgICAgIHRoaXMuZGlhbG9nID0gbnVsbDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IGFueSk6IHZvaWQge1xyXG4gICAgaWYgKGNoYW5nZXMuY3BUb2dnbGUgJiYgIXRoaXMuY3BEaXNhYmxlZCkge1xyXG4gICAgICBpZiAoY2hhbmdlcy5jcFRvZ2dsZS5jdXJyZW50VmFsdWUpIHtcclxuICAgICAgICB0aGlzLm9wZW5EaWFsb2coKTtcclxuICAgICAgfSBlbHNlIGlmICghY2hhbmdlcy5jcFRvZ2dsZS5jdXJyZW50VmFsdWUpIHtcclxuICAgICAgICB0aGlzLmNsb3NlRGlhbG9nKCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAoY2hhbmdlcy5jb2xvclBpY2tlcikge1xyXG4gICAgICBpZiAodGhpcy5kaWFsb2cgJiYgIXRoaXMuaWdub3JlQ2hhbmdlcykge1xyXG4gICAgICAgIGlmICh0aGlzLmNwRGlhbG9nRGlzcGxheSA9PT0gJ2lubGluZScpIHtcclxuICAgICAgICAgIHRoaXMuZGlhbG9nLnNldEluaXRpYWxDb2xvcihjaGFuZ2VzLmNvbG9yUGlja2VyLmN1cnJlbnRWYWx1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmRpYWxvZy5zZXRDb2xvckZyb21TdHJpbmcoY2hhbmdlcy5jb2xvclBpY2tlci5jdXJyZW50VmFsdWUsIGZhbHNlKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY3BVc2VSb290Vmlld0NvbnRhaW5lciAmJiB0aGlzLmNwRGlhbG9nRGlzcGxheSAhPT0gJ2lubGluZScpIHtcclxuICAgICAgICAgIHRoaXMuY21wUmVmLmNoYW5nZURldGVjdG9yUmVmLmRldGVjdENoYW5nZXMoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuaWdub3JlQ2hhbmdlcyA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChjaGFuZ2VzLmNwUHJlc2V0TGFiZWwgfHwgY2hhbmdlcy5jcFByZXNldENvbG9ycykge1xyXG4gICAgICBpZiAodGhpcy5kaWFsb2cpIHtcclxuICAgICAgICB0aGlzLmRpYWxvZy5zZXRQcmVzZXRDb25maWcodGhpcy5jcFByZXNldExhYmVsLCB0aGlzLmNwUHJlc2V0Q29sb3JzKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIG9wZW5EaWFsb2coKTogdm9pZCB7XHJcbiAgICBpZiAoIXRoaXMuZGlhbG9nQ3JlYXRlZCkge1xyXG4gICAgICBsZXQgdmNSZWYgPSB0aGlzLnZjUmVmO1xyXG5cclxuICAgICAgdGhpcy5kaWFsb2dDcmVhdGVkID0gdHJ1ZTtcclxuICAgICAgdGhpcy52aWV3QXR0YWNoZWRUb0FwcFJlZiA9IGZhbHNlO1xyXG5cclxuICAgICAgaWYgKHRoaXMuY3BVc2VSb290Vmlld0NvbnRhaW5lciAmJiB0aGlzLmNwRGlhbG9nRGlzcGxheSAhPT0gJ2lubGluZScpIHtcclxuICAgICAgICBjb25zdCBjbGFzc09mUm9vdENvbXBvbmVudCA9IHRoaXMuYXBwUmVmLmNvbXBvbmVudFR5cGVzWzBdO1xyXG4gICAgICAgIGNvbnN0IGFwcEluc3RhbmNlID0gdGhpcy5pbmplY3Rvci5nZXQoY2xhc3NPZlJvb3RDb21wb25lbnQsIEluamVjdG9yLk5VTEwpO1xyXG5cclxuICAgICAgICBpZiAoYXBwSW5zdGFuY2UgIT09IEluamVjdG9yLk5VTEwpIHtcclxuICAgICAgICAgIHZjUmVmID0gYXBwSW5zdGFuY2UudmNSZWYgfHwgYXBwSW5zdGFuY2Uudmlld0NvbnRhaW5lclJlZiB8fCB0aGlzLnZjUmVmO1xyXG5cclxuICAgICAgICAgIGlmIChOR19ERVZfTU9ERSAmJiB2Y1JlZiA9PT0gdGhpcy52Y1JlZikge1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ1lvdSBhcmUgdXNpbmcgY3BVc2VSb290Vmlld0NvbnRhaW5lciwgJyArXHJcbiAgICAgICAgICAgICAgJ2J1dCB0aGUgcm9vdCBjb21wb25lbnQgaXMgbm90IGV4cG9zaW5nIHZpZXdDb250YWluZXJSZWYhJyArXHJcbiAgICAgICAgICAgICAgJ1BsZWFzZSBleHBvc2UgaXQgYnkgYWRkaW5nIFxcJ3B1YmxpYyB2Y1JlZjogVmlld0NvbnRhaW5lclJlZlxcJyB0byB0aGUgY29uc3RydWN0b3IuJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMudmlld0F0dGFjaGVkVG9BcHBSZWYgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgY29tcEZhY3RvcnkgPSB0aGlzLmNmci5yZXNvbHZlQ29tcG9uZW50RmFjdG9yeShDb2xvclBpY2tlckNvbXBvbmVudCk7XHJcblxyXG4gICAgICBpZiAodGhpcy52aWV3QXR0YWNoZWRUb0FwcFJlZikge1xyXG4gICAgICAgIHRoaXMuY21wUmVmID0gY29tcEZhY3RvcnkuY3JlYXRlKHRoaXMuaW5qZWN0b3IpO1xyXG4gICAgICAgIHRoaXMuYXBwUmVmLmF0dGFjaFZpZXcodGhpcy5jbXBSZWYuaG9zdFZpZXcpO1xyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoKHRoaXMuY21wUmVmLmhvc3RWaWV3IGFzIEVtYmVkZGVkVmlld1JlZjxhbnk+KS5yb290Tm9kZXNbMF0gYXMgSFRNTEVsZW1lbnQpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnN0IGluamVjdG9yID0gSW5qZWN0b3IuY3JlYXRlKHtcclxuICAgICAgICAgIHByb3ZpZGVyczogW10sXHJcbiAgICAgICAgICAvLyBXZSBzaG91bGRuJ3QgdXNlIGB2Y1JlZi5wYXJlbnRJbmplY3RvcmAgc2luY2UgaXQncyBiZWVuIGRlcHJlY2F0ZWQgbG9uZyB0aW1lIGFnbyBhbmQgbWlnaHQgYmUgcmVtb3ZlZFxyXG4gICAgICAgICAgLy8gaW4gbmV3ZXIgQW5ndWxhciB2ZXJzaW9uczogaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9wdWxsLzI1MTc0LlxyXG4gICAgICAgICAgcGFyZW50OiB2Y1JlZi5pbmplY3RvcixcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5jbXBSZWYgPSB2Y1JlZi5jcmVhdGVDb21wb25lbnQoY29tcEZhY3RvcnksIDAsIGluamVjdG9yLCBbXSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuY21wUmVmLmluc3RhbmNlLnNldHVwRGlhbG9nKHRoaXMsIHRoaXMuZWxSZWYsIHRoaXMuY29sb3JQaWNrZXIsXHJcbiAgICAgICAgdGhpcy5jcFdpZHRoLCB0aGlzLmNwSGVpZ2h0LCB0aGlzLmNwRGlhbG9nRGlzcGxheSwgdGhpcy5jcEZhbGxiYWNrQ29sb3IsIHRoaXMuY3BDb2xvck1vZGUsXHJcbiAgICAgICAgdGhpcy5jcENteWtFbmFibGVkLCB0aGlzLmNwQWxwaGFDaGFubmVsLCB0aGlzLmNwT3V0cHV0Rm9ybWF0LCB0aGlzLmNwRGlzYWJsZUlucHV0LFxyXG4gICAgICAgIHRoaXMuY3BJZ25vcmVkRWxlbWVudHMsIHRoaXMuY3BTYXZlQ2xpY2tPdXRzaWRlLCB0aGlzLmNwQ2xvc2VDbGlja091dHNpZGUsXHJcbiAgICAgICAgdGhpcy5jcFVzZVJvb3RWaWV3Q29udGFpbmVyLCB0aGlzLmNwUG9zaXRpb24sIHRoaXMuY3BQb3NpdGlvbk9mZnNldCxcclxuICAgICAgICB0aGlzLmNwUG9zaXRpb25SZWxhdGl2ZVRvQXJyb3csIHRoaXMuY3BQcmVzZXRMYWJlbCwgdGhpcy5jcFByZXNldENvbG9ycyxcclxuICAgICAgICB0aGlzLmNwUHJlc2V0Q29sb3JzQ2xhc3MsIHRoaXMuY3BNYXhQcmVzZXRDb2xvcnNMZW5ndGgsIHRoaXMuY3BQcmVzZXRFbXB0eU1lc3NhZ2UsXHJcbiAgICAgICAgdGhpcy5jcFByZXNldEVtcHR5TWVzc2FnZUNsYXNzLCB0aGlzLmNwT0tCdXR0b24sIHRoaXMuY3BPS0J1dHRvbkNsYXNzLFxyXG4gICAgICAgIHRoaXMuY3BPS0J1dHRvblRleHQsIHRoaXMuY3BDYW5jZWxCdXR0b24sIHRoaXMuY3BDYW5jZWxCdXR0b25DbGFzcyxcclxuICAgICAgICB0aGlzLmNwQ2FuY2VsQnV0dG9uVGV4dCwgdGhpcy5jcEFkZENvbG9yQnV0dG9uLCB0aGlzLmNwQWRkQ29sb3JCdXR0b25DbGFzcyxcclxuICAgICAgICB0aGlzLmNwQWRkQ29sb3JCdXR0b25UZXh0LCB0aGlzLmNwUmVtb3ZlQ29sb3JCdXR0b25DbGFzcywgdGhpcy5jcEV5ZURyb3BwZXIsIHRoaXMuZWxSZWYsXHJcbiAgICAgICAgdGhpcy5jcEV4dHJhVGVtcGxhdGUpO1xyXG5cclxuICAgICAgdGhpcy5kaWFsb2cgPSB0aGlzLmNtcFJlZi5pbnN0YW5jZTtcclxuXHJcbiAgICAgIGlmICh0aGlzLnZjUmVmICE9PSB2Y1JlZikge1xyXG4gICAgICAgIHRoaXMuY21wUmVmLmNoYW5nZURldGVjdG9yUmVmLmRldGVjdENoYW5nZXMoKTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIGlmICh0aGlzLmRpYWxvZykge1xyXG4gICAgICAvLyBVcGRhdGUgcHJvcGVydGllcy5cclxuICAgICAgdGhpcy5jbXBSZWYuaW5zdGFuY2UuY3BBbHBoYUNoYW5uZWwgPSB0aGlzLmNwQWxwaGFDaGFubmVsO1xyXG5cclxuICAgICAgLy8gT3BlbiBkaWFsb2cuXHJcbiAgICAgIHRoaXMuZGlhbG9nLm9wZW5EaWFsb2codGhpcy5jb2xvclBpY2tlcik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgY2xvc2VEaWFsb2coKTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5kaWFsb2cgJiYgdGhpcy5jcERpYWxvZ0Rpc3BsYXkgPT09ICdwb3B1cCcpIHtcclxuICAgICAgdGhpcy5kaWFsb2cuY2xvc2VEaWFsb2coKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyBjbXlrQ2hhbmdlZCh2YWx1ZTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICB0aGlzLmNwQ215a0NvbG9yQ2hhbmdlLmVtaXQodmFsdWUpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHN0YXRlQ2hhbmdlZChzdGF0ZTogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgdGhpcy5jcFRvZ2dsZUNoYW5nZS5lbWl0KHN0YXRlKTtcclxuXHJcbiAgICBpZiAoc3RhdGUpIHtcclxuICAgICAgdGhpcy5jb2xvclBpY2tlck9wZW4uZW1pdCh0aGlzLmNvbG9yUGlja2VyKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuY29sb3JQaWNrZXJDbG9zZS5lbWl0KHRoaXMuY29sb3JQaWNrZXIpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIGNvbG9yQ2hhbmdlZCh2YWx1ZTogc3RyaW5nLCBpZ25vcmU6IGJvb2xlYW4gPSB0cnVlKTogdm9pZCB7XHJcbiAgICB0aGlzLmlnbm9yZUNoYW5nZXMgPSBpZ25vcmU7XHJcblxyXG4gICAgdGhpcy5jb2xvclBpY2tlckNoYW5nZS5lbWl0KHZhbHVlKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBjb2xvclNlbGVjdGVkKHZhbHVlOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgIHRoaXMuY29sb3JQaWNrZXJTZWxlY3QuZW1pdCh2YWx1ZSk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgY29sb3JDYW5jZWxlZCgpOiB2b2lkIHtcclxuICAgIHRoaXMuY29sb3JQaWNrZXJDYW5jZWwuZW1pdCgpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGlucHV0Rm9jdXMoKTogdm9pZCB7XHJcbiAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5lbFJlZi5uYXRpdmVFbGVtZW50O1xyXG5cclxuICAgIGNvbnN0IGlnbm9yZWQgPSB0aGlzLmNwSWdub3JlZEVsZW1lbnRzLmZpbHRlcigoaXRlbTogYW55KSA9PiBpdGVtID09PSBlbGVtZW50KTtcclxuXHJcbiAgICBpZiAoIXRoaXMuY3BEaXNhYmxlZCAmJiAhaWdub3JlZC5sZW5ndGgpIHtcclxuICAgICAgaWYgKHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcgJiYgZWxlbWVudCA9PT0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkge1xyXG4gICAgICAgIHRoaXMub3BlbkRpYWxvZygpO1xyXG4gICAgICB9IGVsc2UgaWYgKCF0aGlzLmRpYWxvZyB8fCAhdGhpcy5kaWFsb2cuc2hvdykge1xyXG4gICAgICAgIHRoaXMub3BlbkRpYWxvZygpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuY2xvc2VEaWFsb2coKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIGlucHV0Q2hhbmdlKGV2ZW50OiBhbnkpOiB2b2lkIHtcclxuICAgIGlmICh0aGlzLmRpYWxvZykge1xyXG4gICAgICB0aGlzLmRpYWxvZy5zZXRDb2xvckZyb21TdHJpbmcoZXZlbnQudGFyZ2V0LnZhbHVlLCB0cnVlKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuY29sb3JQaWNrZXIgPSBldmVudC50YXJnZXQudmFsdWU7XHJcblxyXG4gICAgICB0aGlzLmNvbG9yUGlja2VyQ2hhbmdlLmVtaXQodGhpcy5jb2xvclBpY2tlcik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgaW5wdXRDaGFuZ2VkKGV2ZW50OiBhbnkpOiB2b2lkIHtcclxuICAgIHRoaXMuY3BJbnB1dENoYW5nZS5lbWl0KGV2ZW50KTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBzbGlkZXJDaGFuZ2VkKGV2ZW50OiBhbnkpOiB2b2lkIHtcclxuICAgIHRoaXMuY3BTbGlkZXJDaGFuZ2UuZW1pdChldmVudCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc2xpZGVyRHJhZ0VuZChldmVudDogeyBzbGlkZXI6IHN0cmluZywgY29sb3I6IHN0cmluZyB9KTogdm9pZCB7XHJcbiAgICB0aGlzLmNwU2xpZGVyRHJhZ0VuZC5lbWl0KGV2ZW50KTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBzbGlkZXJEcmFnU3RhcnQoZXZlbnQ6IHsgc2xpZGVyOiBzdHJpbmcsIGNvbG9yOiBzdHJpbmcgfSk6IHZvaWQge1xyXG4gICAgdGhpcy5jcFNsaWRlckRyYWdTdGFydC5lbWl0KGV2ZW50KTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBwcmVzZXRDb2xvcnNDaGFuZ2VkKHZhbHVlOiBhbnlbXSk6IHZvaWQge1xyXG4gICAgdGhpcy5jcFByZXNldENvbG9yc0NoYW5nZS5lbWl0KHZhbHVlKTtcclxuICB9XHJcbn1cclxuIl19