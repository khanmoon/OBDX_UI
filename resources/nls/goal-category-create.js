define(
    [],
    function() {
        "use strict";
        var GoalLocale = function() {
            return {
                root: {
                    goal: {
                        interestslab: {
                            title: "View Interest Rates",
                            amount: "Amount",
                            tenure: "Tenure",
                            rate: "Rate of interest (% Per Annum)",
                            caption: "Interest rate slabs",
                            fromto: "{from} - {to}",
                            fromtotenure: "{from} to {to}",
                            years: "{years} Years",
                            months: "{months} Months",
                            percent: "{percent}%",
                            ok: "Ok",
                            andabove: "{value} & Above"
                        },
                        initialFunding: "Min - {minAmount}   Max - {maxAmount}",
                        tenure: "Min - {minTenure} yrs   Max - {maxTenure} Yrs",
                        category: {
                            createCategoryConfirm: "Transaction",
                            goalCode: "Category Code",
                            goalCategory: "Category Name",
                            enterCode: "Enter Code",
                            enterCategory: "Enter Name",
                            createTitle: "Goal Category Maintenance",
                            create: "Create",
                            code: "Code",
                            image: "Category Image",
                            productMapping: "Product Mapping",
                            subCategory: "Sub Category Details",
                            name: "Name",
                            description: "Description",
                            expiryDate: "Expiry Date",
                            status: "Status",
                            categoryAdded: "Category {name} has been successfully created",
                            subFailed: "{name} added to your Goal Categories but sub categories could not be added",
                            product: "Product",
                            productDetails: "Product Details",
                            initialFunding: "Initial Funding Limit",
                            currency: "Currency",
                            topUpAllowed: "Top Up Allowed",
                            partialWithdrawalAllowed: "Partial Withdrawal Allowed",
                            tenure: "Tenure",
                            interestRate: "Interest Rate",
                            topUpLimit: "Top Up Limit",
                            partialWithdrawalPenalty: "Partial Withdrawal Penalty",
                            list: "Goal Category List Details",
                            interestlink: "View Interest Rates"
                        },
                        reviewHeaderMsg: "You initiated a request for adding goal category. Please review details before you confirm!"
                    },
                    common: {
                        save: "Save",
                        select: "Select",
                        review: "Review",
                        uploadImage: "Please upload goal category image.",
                        confirm: "Confirm",
                        done: "Done",
                        success: "Successful!",
                        cancel: "Cancel",
                        back: "Back",
                        add: "Add",
                        ok: "Ok"
                    }
                },
                ar: true,
                fr: true,
                cs: true,
                sv: true,
                en: false,
                "en-us": false,
                el: true
            };
        };
        return new GoalLocale();
    }
);
