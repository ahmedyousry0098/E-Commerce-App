import fs  from "fs";
import PDFDocument from "pdfkit";
import { ProductOrderInfo } from "../../types/general.types";
import { Types } from "mongoose";
import path from 'path'

interface I_Invoice {
  shipping: {
      name: string;
      apartment: string;
      building: string;
      city: string;
      country: string;
  };
  date: Date;
  items: ProductOrderInfo[];
  subTotal: number;
  paid: number;
  invoice_nr: Types.ObjectId;
}

export async function createInvoice(invoice: I_Invoice, path: fs.PathLike) {
  let doc = new PDFDocument({ size: "A4", margin: 50 });

  generateHeader(doc);
  generateCustomerInformation(doc, invoice);
  generateInvoiceTable(doc, invoice);
  generateFooter(doc);

  doc.end();
  doc.pipe(fs.createWriteStream(path));
}

function generateHeader(doc: PDFKit.PDFDocument) {
  doc
    .image(path.join(path.resolve(), './src/assets/logo.JPG'), 50, 45, { width: 50 })
    .fillColor("#444444")
    .fontSize(20)
    .text("Yousry's Company", 110, 57)
    .fontSize(10)
    .text("Yousry's Company", 200, 50, { align: "right" })
    .text("Hosary Square", 200, 65, { align: "right" })
    .text("October 6 City", 200, 80, { align: "right" })
    .moveDown();
}

function generateCustomerInformation(doc: PDFKit.PDFDocument, invoice: I_Invoice) {
  doc
    .fillColor("#444444")
    .fontSize(20)
    .text("Invoice", 50, 160);

  generateHr(doc, 185);

  const customerInformationTop = 200;

  doc
    .fontSize(10)
    .text("Invoice Number:", 50, customerInformationTop)
    .font("Helvetica-Bold")
    .text(invoice.invoice_nr.toString(), 150, customerInformationTop)
    .font("Helvetica")
    .text("Invoice Date:", 50, customerInformationTop + 15)
    .text(formatDate(new Date(invoice.date)), 150, customerInformationTop + 15)
    .text("Balance Due:", 50, customerInformationTop + 30)
    .text(
      formatCurrency(invoice.paid),
      150,
      customerInformationTop + 30
    )

    .font("Helvetica-Bold")
    .text(invoice.shipping.name, 350, customerInformationTop)
    .font("Helvetica")
    .text(`apartment ${invoice.shipping.apartment}, building: ${invoice.shipping.building}`, 350, customerInformationTop + 15)
    .text(
      `${invoice.shipping.city}, ${invoice.shipping.country}`,
      350,
      customerInformationTop + 30
    )
    .moveDown();

  generateHr(doc, 252);
}

function generateInvoiceTable(doc: PDFKit.PDFDocument, invoice: I_Invoice) {
  let i;
  const invoiceTableTop = 330;

  console.log(invoice.items);

  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    invoiceTableTop,
    "Item",
    "Unit Cost",
    "Quantity",
    "Line Total"
  );
  generateHr(doc, invoiceTableTop + 20);
  doc.font("Helvetica");

  for (i = 0; i < invoice.items.length; i++) {
    const item = invoice.items[i];
    const position = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
      doc,
      position,
      item.name,
      `${item.unitPrice}`,
      `${item.quantity}`,
      item.totalProductPrice
    );

    generateHr(doc, position + 20);
  }

  const subtotalPosition = invoiceTableTop + (i + 1) * 30;
  generateTableRow(
    doc,
    subtotalPosition,
    "",
    "Subtotal",
    "",
    formatCurrency(invoice.subTotal)
  );

  const paidToDatePosition = subtotalPosition + 20;
  generateTableRow(
    doc,
    paidToDatePosition,
    "",
    "Final Price",
    "",
    formatCurrency(invoice.paid)
  );

  const duePosition = paidToDatePosition + 25;
  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    duePosition,
    "",
    "Balance Due",
    "",
    formatCurrency(invoice.subTotal - invoice.paid)
  );
  doc.font("Helvetica");
}

function generateFooter(doc: PDFKit.PDFDocument) {
  doc
    .fontSize(10)
    .text(
      "Thank you for your business.",
      50,
      780,
      { align: "center", width: 500 }
    );
}

function generateTableRow(
  doc: PDFKit.PDFDocument,
  y: number,
  item: any,
  unitCost: string,
  quantity: string,
  lineTotal: any
) {
  doc
    .fontSize(10)
    .text(item, 50, y)
    .text(unitCost, 280, y, { width: 90, align: "right" })
    .text(quantity, 370, y, { width: 90, align: "right" })
    .text(lineTotal, 0, y, { align: "right" });
}

function generateHr(doc:PDFKit.PDFDocument, y:number) {
  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(50, y)
    .lineTo(550, y)
    .stroke();
}

function formatCurrency(cents:number) {
  return "$" + (cents).toFixed(2);
}

function formatDate(date:Date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return year + "/" + month + "/" + day;
}

export default createInvoice