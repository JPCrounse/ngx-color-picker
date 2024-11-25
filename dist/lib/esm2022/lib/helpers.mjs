import { Directive, Input, Output, EventEmitter, HostListener } from '@angular/core';
import * as i0 from "@angular/core";
export function calculateAutoPositioning(elBounds, triggerElBounds) {
    // Defaults
    let usePositionX = 'right';
    let usePositionY = 'bottom';
    // Calculate collisions
    const { height, width } = elBounds;
    const { top, left } = triggerElBounds;
    const bottom = top + triggerElBounds.height;
    const right = left + triggerElBounds.width;
    const collisionTop = top - height < 0;
    const collisionBottom = bottom + height > (window.innerHeight || document.documentElement.clientHeight);
    const collisionLeft = left - width < 0;
    const collisionRight = right + width > (window.innerWidth || document.documentElement.clientWidth);
    const collisionAll = collisionTop && collisionBottom && collisionLeft && collisionRight;
    // Generate X & Y position values
    if (collisionBottom) {
        usePositionY = 'top';
    }
    if (collisionTop) {
        usePositionY = 'bottom';
    }
    if (collisionLeft) {
        usePositionX = 'right';
    }
    if (collisionRight) {
        usePositionX = 'left';
    }
    // Choose the largest gap available
    if (collisionAll) {
        const postions = ['left', 'right', 'top', 'bottom'];
        return postions.reduce((prev, next) => elBounds[prev] > elBounds[next] ? prev : next);
    }
    if ((collisionLeft && collisionRight)) {
        if (collisionTop) {
            return 'bottom';
        }
        if (collisionBottom) {
            return 'top';
        }
        return top > bottom ? 'top' : 'bottom';
    }
    if ((collisionTop && collisionBottom)) {
        if (collisionLeft) {
            return 'right';
        }
        if (collisionRight) {
            return 'left';
        }
        return left > right ? 'left' : 'right';
    }
    return `${usePositionY}-${usePositionX}`;
}
export function detectIE() {
    let ua = '';
    if (typeof navigator !== 'undefined') {
        ua = navigator.userAgent.toLowerCase();
    }
    const msie = ua.indexOf('msie ');
    if (msie > 0) {
        // IE 10 or older => return version number
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }
    // Other browser
    return false;
}
export class TextDirective {
    rg;
    text;
    newValue = new EventEmitter();
    inputChange(event) {
        const value = event.target.value;
        if (this.rg === undefined) {
            this.newValue.emit(value);
        }
        else {
            const numeric = parseFloat(value);
            this.newValue.emit({ v: numeric, rg: this.rg });
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.11", ngImport: i0, type: TextDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.3.11", type: TextDirective, selector: "[text]", inputs: { rg: "rg", text: "text" }, outputs: { newValue: "newValue" }, host: { listeners: { "input": "inputChange($event)" } }, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.11", ngImport: i0, type: TextDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[text]'
                }]
        }], propDecorators: { rg: [{
                type: Input
            }], text: [{
                type: Input
            }], newValue: [{
                type: Output
            }], inputChange: [{
                type: HostListener,
                args: ['input', ['$event']]
            }] } });
export class SliderDirective {
    elRef;
    listenerMove;
    listenerStop;
    rgX;
    rgY;
    slider;
    dragEnd = new EventEmitter();
    dragStart = new EventEmitter();
    newValue = new EventEmitter();
    mouseDown(event) {
        this.start(event);
    }
    touchStart(event) {
        this.start(event);
    }
    constructor(elRef) {
        this.elRef = elRef;
        this.listenerMove = (event) => this.move(event);
        this.listenerStop = () => this.stop();
    }
    move(event) {
        event.preventDefault();
        this.setCursor(event);
    }
    start(event) {
        this.setCursor(event);
        event.stopPropagation();
        document.addEventListener('mouseup', this.listenerStop);
        document.addEventListener('touchend', this.listenerStop);
        document.addEventListener('mousemove', this.listenerMove);
        document.addEventListener('touchmove', this.listenerMove);
        this.dragStart.emit();
    }
    stop() {
        document.removeEventListener('mouseup', this.listenerStop);
        document.removeEventListener('touchend', this.listenerStop);
        document.removeEventListener('mousemove', this.listenerMove);
        document.removeEventListener('touchmove', this.listenerMove);
        this.dragEnd.emit();
    }
    getX(event) {
        const position = this.elRef.nativeElement.getBoundingClientRect();
        const pageX = (event.pageX !== undefined) ? event.pageX : event.touches[0].pageX;
        return pageX - position.left - window.pageXOffset;
    }
    getY(event) {
        const position = this.elRef.nativeElement.getBoundingClientRect();
        const pageY = (event.pageY !== undefined) ? event.pageY : event.touches[0].pageY;
        return pageY - position.top - window.pageYOffset;
    }
    setCursor(event) {
        const width = this.elRef.nativeElement.offsetWidth;
        const height = this.elRef.nativeElement.offsetHeight;
        const x = Math.max(0, Math.min(this.getX(event), width));
        const y = Math.max(0, Math.min(this.getY(event), height));
        if (this.rgX !== undefined && this.rgY !== undefined) {
            this.newValue.emit({ s: x / width, v: (1 - y / height), rgX: this.rgX, rgY: this.rgY });
        }
        else if (this.rgX === undefined && this.rgY !== undefined) {
            this.newValue.emit({ v: y / height, rgY: this.rgY });
        }
        else if (this.rgX !== undefined && this.rgY === undefined) {
            this.newValue.emit({ v: x / width, rgX: this.rgX });
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.11", ngImport: i0, type: SliderDirective, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.3.11", type: SliderDirective, selector: "[slider]", inputs: { rgX: "rgX", rgY: "rgY", slider: "slider" }, outputs: { dragEnd: "dragEnd", dragStart: "dragStart", newValue: "newValue" }, host: { listeners: { "mousedown": "mouseDown($event)", "touchstart": "touchStart($event)" } }, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.11", ngImport: i0, type: SliderDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[slider]'
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }], propDecorators: { rgX: [{
                type: Input
            }], rgY: [{
                type: Input
            }], slider: [{
                type: Input
            }], dragEnd: [{
                type: Output
            }], dragStart: [{
                type: Output
            }], newValue: [{
                type: Output
            }], mouseDown: [{
                type: HostListener,
                args: ['mousedown', ['$event']]
            }], touchStart: [{
                type: HostListener,
                args: ['touchstart', ['$event']]
            }] } });
export class SliderPosition {
    h;
    s;
    v;
    a;
    constructor(h, s, v, a) {
        this.h = h;
        this.s = s;
        this.v = v;
        this.a = a;
    }
}
export class SliderDimension {
    h;
    s;
    v;
    a;
    constructor(h, s, v, a) {
        this.h = h;
        this.s = s;
        this.v = v;
        this.a = a;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2xpYi9zcmMvbGliL2hlbHBlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQWMsTUFBTSxlQUFlLENBQUM7O0FBa0JqRyxNQUFNLFVBQVUsd0JBQXdCLENBQUMsUUFBMkIsRUFBRSxlQUFrQztJQUN0RyxXQUFXO0lBQ1gsSUFBSSxZQUFZLEdBQUcsT0FBTyxDQUFDO0lBQzNCLElBQUksWUFBWSxHQUFHLFFBQVEsQ0FBQztJQUM1Qix1QkFBdUI7SUFDdkIsTUFBTSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxRQUFRLENBQUM7SUFDbkMsTUFBTSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxlQUFlLENBQUM7SUFDdEMsTUFBTSxNQUFNLEdBQUcsR0FBRyxHQUFHLGVBQWUsQ0FBQyxNQUFNLENBQUM7SUFDNUMsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLGVBQWUsQ0FBQyxLQUFLLENBQUM7SUFFM0MsTUFBTSxZQUFZLEdBQUcsR0FBRyxHQUFHLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFDdEMsTUFBTSxlQUFlLEdBQUcsTUFBTSxHQUFHLE1BQU0sR0FBRyxDQUFDLE1BQU0sQ0FBQyxXQUFXLElBQUksUUFBUSxDQUFDLGVBQWUsQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUN4RyxNQUFNLGFBQWEsR0FBRyxJQUFJLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQztJQUN2QyxNQUFNLGNBQWMsR0FBRyxLQUFLLEdBQUcsS0FBSyxHQUFHLENBQUMsTUFBTSxDQUFDLFVBQVUsSUFBSSxRQUFRLENBQUMsZUFBZSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ25HLE1BQU0sWUFBWSxHQUFHLFlBQVksSUFBSSxlQUFlLElBQUksYUFBYSxJQUFJ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QUNHLFNBQVM7c0JBQWxCLE1BQU07Z0JBRUcsUUFBUTtzQkFBakIsTUFBTTtnQkFFZ0MsU0FBUztzQkFBL0MsWUFBWTt1QkFBQyxXQUFXLEVBQUUsQ0FBQyxRQUFRLENBQUM7Z0JBSUcsVUFBVTtzQkFBakQsWUFBWTt1QkFBQyxZQUFZLEVBQUUsQ0FBQyxRQUFRLENBQUM7O0FBdUV4QyxNQUFNLE9BQU8sY0FBYztJQUNOO0lBQWtCO0lBQWtCO0lBQWtCO0lBQXpFLFlBQW1CLENBQVMsRUFBUyxDQUFTLEVBQVMsQ0FBUyxFQUFTLENBQVM7UUFBL0QsTUFBQyxHQUFELENBQUMsQ0FBUTtRQUFTLE1BQUMsR0FBRCxDQUFDLENBQVE7UUFBUyxNQUFDLEdBQUQsQ0FBQyxDQUFRO1FBQVMsTUFBQyxHQUFELENBQUMsQ0FBUTtJQUFHLENBQUM7Q0FDdkY7QUFFRCxNQUFNLE9BQU8sZUFBZTtJQUNQO0lBQWtCO0lBQWtCO0lBQWtCO0lBQXpFLFlBQW1CLENBQVMsRUFBUyxDQUFTLEVBQVMsQ0FBUyxFQUFTLENBQVM7UUFBL0QsTUFBQyxHQUFELENBQUMsQ0FBUTtRQUFTLE1BQUMsR0FBRCxDQUFDLENBQVE7UUFBUyxNQUFDLEdBQUQsQ0FBQyxDQUFRO1FBQVMsTUFBQyxHQUFELENBQUMsQ0FBUTtJQUFHLENBQUM7Q0FDdkYiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaXJlY3RpdmUsIElucHV0LCBPdXRwdXQsIEV2ZW50RW1pdHRlciwgSG9zdExpc3RlbmVyLCBFbGVtZW50UmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5leHBvcnQgdHlwZSBDb2xvck1vZGUgPSAnY29sb3InIHwgJ2MnIHwgJzEnIHxcclxuICAnZ3JheXNjYWxlJyB8ICdnJyB8ICcyJyB8ICdwcmVzZXRzJyB8ICdwJyB8ICczJztcclxuXHJcbmV4cG9ydCB0eXBlIEFscGhhQ2hhbm5lbCA9ICdlbmFibGVkJyB8ICdkaXNhYmxlZCcgfCAnYWx3YXlzJyB8ICdmb3JjZWQnO1xyXG5cclxuZXhwb3J0IHR5cGUgQm91bmRpbmdSZWN0YW5nbGUgPSB7XHJcbiAgdG9wOiBudW1iZXI7XHJcbiAgYm90dG9tOiBudW1iZXI7XHJcbiAgbGVmdDogbnVtYmVyO1xyXG4gIHJpZ2h0OiBudW1iZXI7XHJcbiAgaGVpZ2h0OiBudW1iZXI7XHJcbiAgd2lkdGg6IG51bWJlcjtcclxufTtcclxuXHJcbmV4cG9ydCB0eXBlIE91dHB1dEZvcm1hdCA9ICdhdXRvJyB8ICdoZXgnIHwgJ3JnYmEnIHwgJ2hzbGEnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNhbGN1bGF0ZUF1dG9Qb3NpdGlvbmluZyhlbEJvdW5kczogQm91bmRpbmdSZWN0YW5nbGUsIHRyaWdnZXJFbEJvdW5kczogQm91bmRpbmdSZWN0YW5nbGUpOiBzdHJpbmcge1xyXG4gIC8vIERlZmF1bHRzXHJcbiAgbGV0IHVzZVBvc2l0aW9uWCA9ICdyaWdodCc7XHJcbiAgbGV0IHVzZVBvc2l0aW9uWSA9ICdib3R0b20nO1xyXG4gIC8vIENhbGN1bGF0ZSBjb2xsaXNpb25zXHJcbiAgY29uc3QgeyBoZWlnaHQsIHdpZHRoIH0gPSBlbEJvdW5kcztcclxuICBjb25zdCB7IHRvcCwgbGVmdCB9ID0gdHJpZ2dlckVsQm91bmRzO1xyXG4gIGNvbnN0IGJvdHRvbSA9IHRvcCArIHRyaWdnZXJFbEJvdW5kcy5oZWlnaHQ7XHJcbiAgY29uc3QgcmlnaHQgPSBsZWZ0ICsgdHJpZ2dlckVsQm91bmRzLndpZHRoO1xyXG5cclxuICBjb25zdCBjb2xsaXNpb25Ub3AgPSB0b3AgLSBoZWlnaHQgPCAwO1xyXG4gIGNvbnN0IGNvbGxpc2lvbkJvdHRvbSA9IGJvdHRvbSArIGhlaWdodCA+ICh3aW5kb3cuaW5uZXJIZWlnaHQgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodCk7XHJcbiAgY29uc3QgY29sbGlzaW9uTGVmdCA9IGxlZnQgLSB3aWR0aCA8IDA7XHJcbiAgY29uc3QgY29sbGlzaW9uUmlnaHQgPSByaWdodCArIHdpZHRoID4gKHdpbmRvdy5pbm5lcldpZHRoIHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCk7XHJcbiAgY29uc3QgY29sbGlzaW9uQWxsID0gY29sbGlzaW9uVG9wICYmIGNvbGxpc2lvbkJvdHRvbSAmJiBjb2xsaXNpb25MZWZ0ICYmIGNvbGxpc2lvblJpZ2h0O1xyXG5cclxuICAvLyBHZW5lcmF0ZSBYICYgWSBwb3NpdGlvbiB2YWx1ZXNcclxuICBpZiAoY29sbGlzaW9uQm90dG9tKSB7XHJcbiAgICB1c2VQb3NpdGlvblkgPSAndG9wJztcclxuICB9XHJcblxyXG4gIGlmIChjb2xsaXNpb25Ub3ApIHtcclxuICAgIHVzZVBvc2l0aW9uWSA9ICdib3R0b20nO1xyXG4gIH1cclxuXHJcbiAgaWYgKGNvbGxpc2lvbkxlZnQpIHtcclxuICAgIHVzZVBvc2l0aW9uWCA9ICdyaWdodCc7XHJcbiAgfVxyXG5cclxuICBpZiAoY29sbGlzaW9uUmlnaHQpIHtcclxuICAgIHVzZVBvc2l0aW9uWCA9ICdsZWZ0JztcclxuICB9XHJcblxyXG5cclxuICAvLyBDaG9vc2UgdGhlIGxhcmdlc3QgZ2FwIGF2YWlsYWJsZVxyXG4gIGlmIChjb2xsaXNpb25BbGwpIHtcclxuICAgIGNvbnN0IHBvc3Rpb25zID0gWydsZWZ0JywgJ3JpZ2h0JywgJ3RvcCcsICdib3R0b20nXTtcclxuICAgIHJldHVybiBwb3N0aW9ucy5yZWR1Y2UoKHByZXYsIG5leHQpID0+IGVsQm91bmRzW3ByZXZdID4gZWxCb3VuZHNbbmV4dF0gPyBwcmV2IDogbmV4dCk7XHJcbiAgfVxyXG5cclxuICBpZiAoKGNvbGxpc2lvbkxlZnQgJiYgY29sbGlzaW9uUmlnaHQpKSB7XHJcbiAgICBpZiAoY29sbGlzaW9uVG9wKSB7IHJldHVybiAnYm90dG9tJzsgfVxyXG4gICAgaWYgKGNvbGxpc2lvbkJvdHRvbSkgeyByZXR1cm4gJ3RvcCc7IH1cclxuICAgIHJldHVybiB0b3AgPiBib3R0b20gPyAndG9wJyA6ICdib3R0b20nO1xyXG4gIH1cclxuXHJcbiAgaWYgKChjb2xsaXNpb25Ub3AgJiYgY29sbGlzaW9uQm90dG9tKSkge1xyXG4gICAgaWYgKGNvbGxpc2lvbkxlZnQpIHsgcmV0dXJuICdyaWdodCc7IH1cclxuICAgIGlmIChjb2xsaXNpb25SaWdodCkgeyByZXR1cm4gJ2xlZnQnOyB9XHJcbiAgICByZXR1cm4gbGVmdCA+IHJpZ2h0ID8gJ2xlZnQnIDogJ3JpZ2h0JztcclxuICB9XHJcblxyXG4gIHJldHVybiBgJHt1c2VQb3NpdGlvbll9LSR7dXNlUG9zaXRpb25YfWA7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkZXRlY3RJRSgpOiBib29sZWFuIHwgbnVtYmVyIHtcclxuICBsZXQgdWEgPSAnJztcclxuXHJcbiAgaWYgKHR5cGVvZiBuYXZpZ2F0b3IgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICB1YSA9IG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKTtcclxuICB9XHJcblxyXG4gIGNvbnN0IG1zaWUgPSB1YS5pbmRleE9mKCdtc2llICcpO1xyXG5cclxuICBpZiAobXNpZSA+IDApIHtcclxuICAgIC8vIElFIDEwIG9yIG9sZGVyID0+IHJldHVybiB2ZXJzaW9uIG51bWJlclxyXG4gICAgcmV0dXJuIHBhcnNlSW50KHVhLnN1YnN0cmluZyhtc2llICsgNSwgdWEuaW5kZXhPZignLicsIG1zaWUpKSwgMTApO1xyXG4gIH1cclxuXHJcbiAgLy8gT3RoZXIgYnJvd3NlclxyXG4gIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuQERpcmVjdGl2ZSh7XHJcbiAgc2VsZWN0b3I6ICdbdGV4dF0nXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBUZXh0RGlyZWN0aXZlIHtcclxuICBASW5wdXQoKSByZzogbnVtYmVyO1xyXG4gIEBJbnB1dCgpIHRleHQ6IGFueTtcclxuXHJcbiAgQE91dHB1dCgpIG5ld1ZhbHVlID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XHJcblxyXG4gIEBIb3N0TGlzdGVuZXIoJ2lucHV0JywgWyckZXZlbnQnXSkgaW5wdXRDaGFuZ2UoZXZlbnQ6IGFueSk6IHZvaWQge1xyXG4gICAgY29uc3QgdmFsdWUgPSBldmVudC50YXJnZXQudmFsdWU7XHJcblxyXG4gICAgaWYgKHRoaXMucmcgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICB0aGlzLm5ld1ZhbHVlLmVtaXQodmFsdWUpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY29uc3QgbnVtZXJpYyA9IHBhcnNlRmxvYXQodmFsdWUpO1xyXG5cclxuICAgICAgdGhpcy5uZXdWYWx1ZS5lbWl0KHsgdjogbnVtZXJpYywgcmc6IHRoaXMucmcgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5ARGlyZWN0aXZlKHtcclxuICBzZWxlY3RvcjogJ1tzbGlkZXJdJ1xyXG59KVxyXG5leHBvcnQgY2xhc3MgU2xpZGVyRGlyZWN0aXZlIHtcclxuICBwcml2YXRlIGxpc3RlbmVyTW92ZTogYW55O1xyXG4gIHByaXZhdGUgbGlzdGVuZXJTdG9wOiBhbnk7XHJcblxyXG4gIEBJbnB1dCgpIHJnWDogbnVtYmVyO1xyXG4gIEBJbnB1dCgpIHJnWTogbnVtYmVyO1xyXG5cclxuICBASW5wdXQoKSBzbGlkZXI6IHN0cmluZztcclxuXHJcbiAgQE91dHB1dCgpIGRyYWdFbmQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgQE91dHB1dCgpIGRyYWdTdGFydCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgQE91dHB1dCgpIG5ld1ZhbHVlID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XHJcblxyXG4gIEBIb3N0TGlzdGVuZXIoJ21vdXNlZG93bicsIFsnJGV2ZW50J10pIG1vdXNlRG93bihldmVudDogYW55KTogdm9pZCB7XHJcbiAgICB0aGlzLnN0YXJ0KGV2ZW50KTtcclxuICB9XHJcblxyXG4gIEBIb3N0TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBbJyRldmVudCddKSB0b3VjaFN0YXJ0KGV2ZW50OiBhbnkpOiB2b2lkIHtcclxuICAgIHRoaXMuc3RhcnQoZXZlbnQpO1xyXG4gIH1cclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBlbFJlZjogRWxlbWVudFJlZikge1xyXG4gICAgdGhpcy5saXN0ZW5lck1vdmUgPSAoZXZlbnQ6IGFueSkgPT4gdGhpcy5tb3ZlKGV2ZW50KTtcclxuXHJcbiAgICB0aGlzLmxpc3RlbmVyU3RvcCA9ICgpID0+IHRoaXMuc3RvcCgpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBtb3ZlKGV2ZW50OiBhbnkpOiB2b2lkIHtcclxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgdGhpcy5zZXRDdXJzb3IoZXZlbnQpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzdGFydChldmVudDogYW55KTogdm9pZCB7XHJcbiAgICB0aGlzLnNldEN1cnNvcihldmVudCk7XHJcblxyXG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblxyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMubGlzdGVuZXJTdG9wKTtcclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdGhpcy5saXN0ZW5lclN0b3ApO1xyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5saXN0ZW5lck1vdmUpO1xyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgdGhpcy5saXN0ZW5lck1vdmUpO1xyXG5cclxuICAgIHRoaXMuZHJhZ1N0YXJ0LmVtaXQoKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc3RvcCgpOiB2b2lkIHtcclxuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLmxpc3RlbmVyU3RvcCk7XHJcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIHRoaXMubGlzdGVuZXJTdG9wKTtcclxuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMubGlzdGVuZXJNb3ZlKTtcclxuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHRoaXMubGlzdGVuZXJNb3ZlKTtcclxuXHJcbiAgICB0aGlzLmRyYWdFbmQuZW1pdCgpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZXRYKGV2ZW50OiBhbnkpOiBudW1iZXIge1xyXG4gICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLmVsUmVmLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcblxyXG4gICAgY29uc3QgcGFnZVggPSAoZXZlbnQucGFnZVggIT09IHVuZGVmaW5lZCkgPyBldmVudC5wYWdlWCA6IGV2ZW50LnRvdWNoZXNbMF0ucGFnZVg7XHJcblxyXG4gICAgcmV0dXJuIHBhZ2VYIC0gcG9zaXRpb24ubGVmdCAtIHdpbmRvdy5wYWdlWE9mZnNldDtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZ2V0WShldmVudDogYW55KTogbnVtYmVyIHtcclxuICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5lbFJlZi5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG5cclxuICAgIGNvbnN0IHBhZ2VZID0gKGV2ZW50LnBhZ2VZICE9PSB1bmRlZmluZWQpID8gZXZlbnQucGFnZVkgOiBldmVudC50b3VjaGVzWzBdLnBhZ2VZO1xyXG5cclxuICAgIHJldHVybiBwYWdlWSAtIHBvc2l0aW9uLnRvcCAtIHdpbmRvdy5wYWdlWU9mZnNldDtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc2V0Q3Vyc29yKGV2ZW50OiBhbnkpOiB2b2lkIHtcclxuICAgIGNvbnN0IHdpZHRoID0gdGhpcy5lbFJlZi5uYXRpdmVFbGVtZW50Lm9mZnNldFdpZHRoO1xyXG4gICAgY29uc3QgaGVpZ2h0ID0gdGhpcy5lbFJlZi5uYXRpdmVFbGVtZW50Lm9mZnNldEhlaWdodDtcclxuXHJcbiAgICBjb25zdCB4ID0gTWF0aC5tYXgoMCwgTWF0aC5taW4odGhpcy5nZXRYKGV2ZW50KSwgd2lkdGgpKTtcclxuICAgIGNvbnN0IHkgPSBNYXRoLm1heCgwLCBNYXRoLm1pbih0aGlzLmdldFkoZXZlbnQpLCBoZWlnaHQpKTtcclxuXHJcbiAgICBpZiAodGhpcy5yZ1ggIT09IHVuZGVmaW5lZCAmJiB0aGlzLnJnWSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHRoaXMubmV3VmFsdWUuZW1pdCh7IHM6IHggLyB3aWR0aCwgdjogKDEgLSB5IC8gaGVpZ2h0KSwgcmdYOiB0aGlzLnJnWCwgcmdZOiB0aGlzLnJnWSB9KTtcclxuICAgIH0gZWxzZSBpZiAodGhpcy5yZ1ggPT09IHVuZGVmaW5lZCAmJiB0aGlzLnJnWSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHRoaXMubmV3VmFsdWUuZW1pdCh7IHY6IHkgLyBoZWlnaHQsIHJnWTogdGhpcy5yZ1kgfSk7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMucmdYICE9PSB1bmRlZmluZWQgJiYgdGhpcy5yZ1kgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICB0aGlzLm5ld1ZhbHVlLmVtaXQoeyB2OiB4IC8gd2lkdGgsIHJnWDogdGhpcy5yZ1ggfSk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgU2xpZGVyUG9zaXRpb24ge1xyXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBoOiBudW1iZXIsIHB1YmxpYyBzOiBudW1iZXIsIHB1YmxpYyB2OiBudW1iZXIsIHB1YmxpYyBhOiBudW1iZXIpIHt9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBTbGlkZXJEaW1lbnNpb24ge1xyXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBoOiBudW1iZXIsIHB1YmxpYyBzOiBudW1iZXIsIHB1YmxpYyB2OiBudW1iZXIsIHB1YmxpYyBhOiBudW1iZXIpIHt9XHJcbn1cclxuIl19