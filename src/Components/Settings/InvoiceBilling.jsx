import moment from 'moment'
import React from 'react'

const InvoiceBilling = ({ InvoiceRef ,selectData}) => {
    return (
        <>
            <div ref={InvoiceRef} className='p-6'>
                <div className="full flex flex-wrap -mx-3 mb-3">
                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0"><img src="dist/images/black-logo.png" alt="" />
                        {/*<div className="screen-count text-left py-3"><strong>Customer ID:</strong>
                            <p>#5036</p>
    </div>*/}
                        <div className="screen-count text-left py-3"><strong>Customer Name:</strong>
                            <p>{selectData?.name}</p>
                        </div>
                        <div className="screen-count text-left py-3"><strong>Bill To Address:</strong>
                            <p>{selectData?.address}</p>
                            <p>{selectData?.phoneNumber}</p>
                        </div>
                    </div>
                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <div className="screen-count text-right border-b border-gray pb-3"><strong className="text-right">Disploy, LLC. Invoice</strong>
                            <p className="text-right">Email or talk to us about your Display account or bill visit disploy.com/</p>
                        </div>
                        <div className="screen-count text-right border-b border-gray py-3"><strong className="text-right">Invoice Summary</strong></div>
                        <div className="flex justify-between border-b border-gray text-right py-3">
                            <label>Invoice Number:</label><span>{selectData?.invoiceNumber}</span></div>
                        <div className="flex justify-between border-b border-gray text-right py-3">
                            <label>Invoice Date:</label><span>DD / MM / YYYY</span></div>
                        <div className="flex justify-between border-b border-gray text-right py-3"><b>Total Amount due on {moment(
                            selectData?.dueDate
                          ).format("LL")}</b></div>
                    </div>
                </div>
                <div className="full mb-3 "><strong>This invoice is for the billing period {moment(selectData?.issuedDate).format("LL")} - {moment(selectData?.dueDate).format("LL")}</strong>
                    <p> Greetings from disploy web services, we’re writing to provide you with an electronic invoice for your use of disploy services. Additional information about your bill, individual services charge details, and your account history are available on the Account Activity page.</p>
                </div>
                <div className="full ">
                    <div className="bg-blue-lighter screen-count text-left border-b border-gray py-3 px-3"><strong className="text-left">Summary</strong></div>
                    <div className="flex justify-between border-b border-gray text-right py-3 px-3">
                        <label className="text-SlateBlue">{selectData?.paymentType === "Storage" ? `${selectData?.paymentValue}GB` : selectData?.paymentValue} x {selectData?.paymentType}</label><span>${(selectData?.totalAmount)/100}.00</span></div>
                    <div className="flex justify-between border-b border-gray text-right py-3 px-3">
                        <label>Discount</label><span>$ 0.00</span></div>
                    <div className="flex justify-between border-b border-gray text-right py-3 px-3">
                        <label>Tax</label><span>$ 0.00</span></div>
                    <div className="bg-gray-100 flex justify-between border-b border-gray text-right py-3 px-3"><b>Total Amount due on {moment(
                        selectData?.dueDate
                      ).format("LL")}</b><b>${(selectData?.totalAmount)/100}.00</b></div>
                </div>
              {/*  <div className="full ">
                    <div className="bg-blue-lighter screen-count text-left border-b border-gray py-3 px-3"><strong className="text-left">Detail</strong></div>
                    <div className="flex justify-between border-b border-gray text-right py-3">
                        <label className="text-SlateBlue">Disploy Additional Services</label><span>$ 100.00</span></div>
                    <div className="flex justify-between border-b border-gray text-right py-3 px-3">
                        <label>1xDisploy Studio</label><span>$ 100.00</span></div>
                    <div className="flex justify-between border-b border-gray text-right py-3 px-3">
                        <label>1xPlaylist</label><span>$ 50.00</span></div>
                    <div className="flex justify-between border-b border-gray text-right py-3 px-3">
                        <label>1xMy Schedule</label><span>$ 150.00</span></div>
                    <div className="bg-gray-100 flex justify-between border-b border-gray text-right py-3 px-3"><b>Total for this invoice</b><b>$ 400.00</b></div>
                        </div>*/}
                {/*<div className="full mb-3 text-center">
                    <h3 className="text-3xl">Subject to Pennsylvania jurisdiction</h3>
                    <p>This is a Computer Generated In voice</p>
                    </div>*/}
            </div>
        </>
    )
}

export default InvoiceBilling
