import { CcName, PaymentCards } from "../../enums/cc-type";

export class CheckoutHelper {
  private static readonly TAX_SKU = 'Tax';
  private static readonly DISCOUNT_SKU = 'Discount';
  private static readonly HEMMING_SKU = 'Hemming Discount';
  private static readonly HEMMING = 'Hemming';
  private static readonly SHIPPING_CATEGORY = 'Shipping';
  private static readonly TAX_CATEGORY = 'Tax';
  private static readonly FREE_SHIPPING_SKU = 'Free Standard Shipping';


  static createCancellationPayload(items: any) {
    return {
      type: 'Cancellation',
      date: new Date().toISOString(),
      couponCode: items?.result?.data?.activityId,
      value: items?.value,
    };
  }

  private static createPayload(
    total: number,
    lineItems: any,
    tenderItems: any,
    location: string,
    returnDate: string | null,
    additionalData: Partial<Record<string, any>> = {}
  ) {
    return {
      date: returnDate ?? new Date(),
      value: parseFloat(total.toFixed(2)),
      srcChannelID: location,
      lineItems,
      tenderItems,
      bestOffers: [],
      ...additionalData,
    };
  }

  static createRepricePayload(
    total: number,
    lineItems: any,
    tenderItems: any,
    location: string,
    returnDate: string | null,
  ) {
    return this.createPayload(total, lineItems, tenderItems, location, returnDate, {
      type: 'Reprice Ticket',
    });
  }

  static createAccrualPayload(
    total: number,
    lineItems: any,
    tenderItems: any,
    location: string,
    bestOffers: any[] = [],
    returnDate: string | null,
  ) {
    return this.createPayload(total, lineItems, tenderItems, location, returnDate, {
      type: 'Accrual',
      bestOffers,
      currencyCode: 'USD',
    });
  }

  static createTenderItems(type: PaymentCards, total: number) {
    return [
      {
        type: PaymentCards[type],
        itemNo: 'a123',
        value: parseFloat(total.toFixed(2)),
        isVoid: false,
        ext: {
          ccType: CcName[type],
        },
      },
    ];
  }

  static createLineItems = (
    cartItems: any = [],
    discountLineItems = [],
    taxAmount: number,
    hemmingAmount = 0,
    shippingProduct: any = {}
  ): any[] => {
    const lineItems: any[] = [];
    hemmingAmount = Math.abs(hemmingAmount);

    const filteredCartItems = cartItems.filter(
      (item: any) => item.category !== CheckoutHelper.SHIPPING_CATEGORY && item.category !== CheckoutHelper.TAX_CATEGORY
    );

    const mapLineItems = (items: any[], type: string, baseIndex: number = 0) =>
      items.map((item: any, index: number) => ({
        itemPrice: item.cost || item.itemPrice,
        itemAmount: (item.cost || item.itemAmount) * (item.quantity ?? 1),
        itemSKU: item.sku || item.itemSKU,
        quantity: item.quantity ?? 1,
        lineNo: baseIndex + index + 1,
        isVoid: false,
        type: item.type || type,
        offerId: item.offerId
      }));

    // Add cart items other than hemming
    lineItems.push(...mapLineItems(filteredCartItems, 'Normal'));

    // Add discount line items
    lineItems.push(...mapLineItems(discountLineItems, 'Discount', lineItems.length));

    // Add hemming discount line items
    const hemmingItems = [cartItems.find((item: any) => item.category === this.HEMMING)].filter(Boolean).map(() => ({
      itemPrice: hemmingAmount > 0 ? -hemmingAmount : 0,
      itemAmount: hemmingAmount > 0 ? -hemmingAmount : 0,
      itemSKU: this.HEMMING_SKU,
      quantity: 1,
      type: this.DISCOUNT_SKU
    }));
    if (!cartItems.some(item => item.sku === this.HEMMING_SKU) && hemmingAmount) {
      lineItems.push(...mapLineItems(hemmingItems, 'Discount', lineItems.length));
    }


    // Add shipping product
    lineItems.push({
      itemPrice: shippingProduct.cost ?? 0,
      itemAmount: shippingProduct.cost ?? 0,
      itemSKU: shippingProduct.sku ?? this.FREE_SHIPPING_SKU,
      quantity: 1,
      type: 'Normal',
      lineNo: lineItems.length + 1
    });

    // Add tax
    lineItems.push({
      itemPrice: taxAmount,
      itemAmount: taxAmount,
      itemSKU: CheckoutHelper.TAX_SKU,
      quantity: 1,
      lineNo: lineItems.length + 1,
      isVoid: false,
      type: CheckoutHelper.TAX_SKU
    });

    return lineItems;
  };

  static calculateTicketDiscount(lineItems: any[] = []) {
    const discountLineItem = lineItems.find(
      (lineItem: any) => lineItem.targetedItems.includes(-1)
    );
    return Math.abs(discountLineItem?.itemPrice ?? 0);
  }

  static calculateSubtotal = (cartItems: any[] = [], returningItems: any[] = []): number =>
    cartItems
      .filter(
        (item: any) =>
          !returningItems.includes(item.sku) &&
          item.category !== CheckoutHelper.TAX_CATEGORY &&
          item.category !== CheckoutHelper.SHIPPING_CATEGORY &&
          item.sku !== CheckoutHelper.HEMMING_SKU
      )
      .reduce(
        (total: number, item: any) => total + (item.cost ?? 0) * (item.quantity ?? 1),
        0
      );

}
