import {
  AfterViewInit,
  Component,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSortModule } from '@angular/material/sort';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MemberService } from '../../services/member/member.service';
import { Store } from '@ngrx/store';
import { Member } from '../../models/member';
import { PurchaseHistory } from '../../models/purchase-history';
import { AlertService } from '../../services/alert/alert.service';
import { distinctUntilChanged, Subscription } from 'rxjs';

import { animate, state, style, transition, trigger } from '@angular/animations';

import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { StandardCurrencyPipe } from "../../pipes/standard-currency/standard-currency.pipe";
import { NoDataComponent } from "../common/no-data/no-data.component";
import { LOB } from '../../enums/lob-enum';

@Component({
  selector: 'app-purchase-history',
  standalone: true,
  imports: [
    MatTableModule,
    FlexLayoutModule,
    MatCardModule,
    MatChipsModule,
    MatPaginatorModule,
    MatSelectModule,
    MatFormFieldModule,
    CommonModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatExpansionModule,
    MatButtonModule,
    StandardCurrencyPipe,
    NoDataComponent
  ],
  providers: [DatePipe],
  templateUrl: './purchase-history.component.html',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  styleUrl: './purchase-history.component.scss'
})

export class PurchaseHistoryComponent implements OnInit, AfterViewInit, OnDestroy {
  private store = inject(Store);
  private readonly ACTIVITY_TYPE_ACCRUAL = 'Accrual';
  private readonly ACTIVITY_STATUS_PROCESSED = 'Processed';
  private static readonly TAX_SKU = 'Tax';
  private static readonly GRATUITY = 'Gratuity';
  private static readonly DISCOUNT_SKU = 'Discount';

  currentDate: string;
  memberInfo?: Member;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['date', 'type', 'bookingId', 'location', 'desc', 'totalSpend', 'total', 'statusPoints', 'rewardEarned', 'expand'];
  dataSource = new MatTableDataSource<PurchaseHistory>();

  skeletonLoader = true;
  purchaseHistory: any[] = [];
  tableData: any[] = [];
  memberPoints: any[] = [];
  pointsLoader = true;
  subscriptions: Subscription[] = [];
  expandedElement: any;

  constructor(private memberService: MemberService, private alertService: AlertService, private datePipe: DatePipe) {
    this.currentDate = this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss.SSS\'Z\'', 'UTC')!;
  }

  ngOnInit() {
    this.subscriptions.push(
      this.store.select('member').pipe(distinctUntilChanged()).subscribe((member: Member) => {
        if (Object.keys(member).length) {
          this.skeletonLoader = true;
          this.dataSource.data = [];
          this.pointsLoader = true;
          this.memberInfo = member;
          this.getActivityHistory();
        }
      }),
    );
  }

  getActivityHistory() {
    this.dataSource.data = [];
    this.skeletonLoader = true;
    this.pointsLoader = true;
    this.subscriptions.push(
      this.memberService.getActivityHistory(this.memberInfo?._id ?? '').subscribe({
        next: (purchaseHistory) => {
          this.purchaseHistory = purchaseHistory.filter((history) => history.status === this.ACTIVITY_STATUS_PROCESSED);
          this.purchaseHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          this.prepareTableData();
          this.skeletonLoader = false;
        }, error: (error) => {
          this.alertService.errorAlert(error?.error?.error || error?.message);
          this.skeletonLoader = false;
        }
      })
    )
  }

  getOffers(lineItems: any, type: string) {
    const discountItems = lineItems.filter((item: any) => item.type === type);
    const uniqueItems: Set<string> = new Set(discountItems.map((item) => item.itemSKU));
    return Array.from(uniqueItems).map((uniq) => ({
      key: uniq, value: discountItems.filter((item) => item.itemSKU === uniq).reduce((a, v) => a + v.itemAmount, 0)
    }))
  }

  getTotal(lineItems: any, type: string = '') {
    return lineItems.filter((item: any) => !type || (type && item.type === type)).reduce((acc, val) => acc + val.itemAmount, 0)
  }

  formatHistory = (history) => {
    const pointsValue = this.getTotalPurse(history.result?.data?.purses);
    return {
      date: history.date,
      bookingId: history?.ext?.folioId ? history.ext.folioId : '-',
      location: history?.location?.name ?? '-',
      desc: history.result?.data?.desc ?? '-',
      total: this.getPurseValue(history.result?.data?.purses, 'Status Points'),
      serviceStatusPoints: this.getPurseValue(history.result?.data?.purses, 'GCGC Status Points'),
      rewardUsed: pointsValue < 0 ? Math.abs(pointsValue) : 0,
      spend: history.value,
      basePoints: pointsValue,
      lob: history?.ext?.lob,
      type: history.type,
      value: history.value,
      id: history._id,
      isExpandable: history.type === this.ACTIVITY_TYPE_ACCRUAL,
      expanded: false,
      gaming: (history?.ext?.gaming),
      lineItems: history.lineItems.map((item: any) => ({ ...item, lob: history?.ext?.lob })),
      summary: {}
    }
  }

  prepareTableData() {
    this.tableData = this.purchaseHistory.map(this.formatHistory)
    this.tableData.forEach((data) => { data.nestedData = this.getNestedData(data.lineItems), data.summary = this.getSummary(data.nestedData) });
    this.dataSource = new MatTableDataSource(this.tableData);
    this.dataSource.paginator = this.paginator;
  }
  getPurseValue(purses: any, type: string) {
    const selectedPurse = purses?.find((purse: any) => purse.name === type);
    if (selectedPurse) {
      return selectedPurse?.new - selectedPurse?.prev;
    }
    return 0;
  }

  getTotalPurse(purses: any, isStatus: boolean = false) {
    const selectedPurse = purses?.filter((purse: any) => isStatus ? purse.name.includes('Status') : !purse.name.includes('Status'));
    if (selectedPurse?.length) {
      return selectedPurse.reduce((acc, purse) => (purse.new - purse.prev) + acc, 0);
    }
    return 0;
  }

  getNestedData(lineItems: any) {
    const nestedData: any = [];
    for (const key of Object.keys(LOB)) {
      const filteredItems = lineItems.filter((lineItem) => lineItem?.lob?.toUpperCase() === key);
      if (filteredItems.length) {
        nestedData.push({
          title: LOB[key],
          subTotal: { key: 'Subtotal', value: this.getTotal(filteredItems, 'Normal') },
          offers: this.getOffers(filteredItems, PurchaseHistoryComponent.DISCOUNT_SKU),
          tax: { key: PurchaseHistoryComponent.TAX_SKU, value: this.getTotal(filteredItems, PurchaseHistoryComponent.TAX_SKU) },
          gratuity: { key: PurchaseHistoryComponent.GRATUITY, value: this.getTotal(filteredItems, PurchaseHistoryComponent.GRATUITY) },
          total: { key: 'Total ' + LOB[key], value: this.getTotal(filteredItems) }
        })
      }
    }
    return nestedData;
  }

  getSummary(nestedData) {
    if (nestedData.length) {
      const summaryData = nestedData.map((data) => ({ key: data.title, value: data.total.value }));
      summaryData.push({ key: 'Total Charges', value: summaryData.reduce((acc, v) => acc + v.value, 0) })
      return summaryData;
    }
  }

  getSign = (val) => (val > 0) ? '+' : '';

  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
      this.paginator._intl.itemsPerPageLabel = "Rows per page";
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(x => x.unsubscribe())
  }
}
