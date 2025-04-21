import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { StandardCurrencyPipe } from '../../../pipes/standard-currency/standard-currency.pipe';

@Component({
  selector: 'app-line-item',
  standalone: true,
  imports: [FlexLayoutModule, StandardCurrencyPipe, CommonModule],
  templateUrl: './line-item.component.html',
  styleUrl: './line-item.component.scss'
})
export class LineItemComponent {
 @Input() lineItem: {
  label: string,
  value: number,
  color?: string,
  size?: string,
  currency?: string, 
 } = {
  label: '',
  value: 0,
  color: '',
  size: '',
  currency: ''
 }
}
