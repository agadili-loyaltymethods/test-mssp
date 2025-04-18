import { AfterViewInit, Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
    selector: '[libEllipsify]',
    standalone: true
})
export class EllipsifyDirective {
    // TODO - causes circular dependency issue when used within a component library.
    domElement: HTMLElement;

    constructor(private renderer: Renderer2, private elementRef: ElementRef) {
        this.domElement = this.elementRef.nativeElement;
    }

    ngAfterViewInit() {
        this.renderer.setProperty(this.domElement, 'scrollTop', 1);

        if (this.domElement.textContent) {
            this.isTitleAttribute();
        } else {
            this.domElement.textContent = '';
        }
    }

    // eslint-disable-next-line @typescript-eslint/member-ordering
    @HostListener('mouseover', [])
    isTitleAttribute() {
        if (this.domElement && this.domElement.textContent !== null) {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            this.domElement.offsetWidth < this.domElement.scrollWidth && this.renderer
                ? this.renderer.setAttribute(this.domElement, 'data-title', this.domElement.textContent)
                : this.renderer.removeAttribute(this.domElement, 'data-title');
        }
    }
}
