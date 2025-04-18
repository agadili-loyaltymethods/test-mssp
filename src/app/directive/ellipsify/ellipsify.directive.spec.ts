import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTooltipModule } from '@angular/material/tooltip';
import { By } from '@angular/platform-browser';

import { EllipsifyDirective } from './ellipsify.directive';

/* prettier-ignore */
@Component({
    template: `<div libEllipsify #element [matTooltip]="element.getAttribute('data-title')" style="width: 210px" class="line-ellipsis">
    Super long text that should display the ellipsis directive.
</div>
<div libEllipsify style="width: 210px" class="line-ellipsis"></div>
`
})
class TestComponent {}

describe('EllipsifyDirective', () => {
    let fixture: ComponentFixture<TestComponent>;
    let des: DebugElement[];

    beforeEach(() => {
        fixture = TestBed.configureTestingModule({
            declarations: [EllipsifyDirective, TestComponent],
            imports: [MatTooltipModule]
        }).createComponent(TestComponent);

        fixture.detectChanges();

        des = fixture.debugElement.queryAll(By.directive(EllipsifyDirective));
    });

    it('should have three highlighted elements', () => {
        expect(des).toHaveLength(2);
    });
});
