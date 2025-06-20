/** @format */
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MoneyIcon from "@mui/icons-material/Money";
import { EmailOutlined } from "@mui/icons-material";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  accountPostOrUnpostJobs,
  accountPriceJobByMileage,
  accountPriceJobHVS,
  accountPriceJobHVSBulk,
  accountUpdateChargesData,
  clearInvoice,
} from "../../../../service/operations/billing&Payment";
import toast from "react-hot-toast";
export default function NotPriced({ handleShow }) {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const { accountChargeableGroupJobs } = useSelector((state) => state.billing);
  const { notPriced } = accountChargeableGroupJobs;
  const [expandedPassengers, setExpandedPassengers] = useState({});
  const [expandedPickupGroups, setExpandedPickupGroups] = useState({});
  const [expandedDestinationGroups, setExpandedDestinationGroups] = useState(
    {}
  );

  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [currentPagePassenger, setCurrentPagePassenger] = useState(0);
  const [itemsPerPagePassenger, setItemsPerPagePassenger] = useState(10);

  const [bookingValues, setBookingValues] = useState({});
  const [debouncedValue, setDebouncedValue] = useState(null);

  // Initialize booking values when data loads
  useEffect(() => {
    const initialValues = {};
    notPriced?.forEach((passengerData) => {
      passengerData.pickupGroups?.forEach((pickupGroup) => {
        pickupGroup.destinationGroups?.forEach((destinationGroup) => {
          destinationGroup.jobs?.forEach((booking) => {
            initialValues[booking.bookingId] = {
              waitingMinutes: booking.waitingMinutes || 0,
              priceAccount: booking.priceAccount || 0,
              price: booking.price || 0,
              parkingCharge: booking.parkingCharge || 0,
              waitingPriceAccount: booking.waitingPriceAccount || 0,
            };
          });
        });
      });
    });
    setBookingValues(initialValues);
  }, [notPriced]);

  const togglePassenger = (passengerId) => {
    setExpandedPassengers((prev) => ({
      ...prev,
      [passengerId]: !prev[passengerId],
    }));
  };

  const togglePickupGroup = (passengerId, pickup) => {
    setExpandedPickupGroups((prev) => ({
      ...prev,
      [`${passengerId}-${pickup}`]: !prev[`${passengerId}-${pickup}`],
    }));
  };

  const toggleDestinationGroup = (passengerId, pickup, destination) => {
    setExpandedDestinationGroups((prev) => ({
      ...prev,
      [`${passengerId}-${pickup}-${destination}`]:
        !prev[`${passengerId}-${pickup}-${destination}`],
    }));
  };

  const handlePriceFromBaseButton = async (booking) => {
    try {
      const payload = {
        pickupPostcode: booking?.pickupPostcode || "",
        viaPostcodes: booking?.vias?.length
          ? booking.vias.map((via) => via.postCode)
          : [], // Map via postcodes
        destinationPostcode: booking?.destinationPostcode || "",
        pickupDateTime: booking?.date || new Date().toISOString(), // Use booking date if available
        passengers: booking?.passengers || 0,
        priceFromBase: true, // Use form value
        bookingId: booking?.bookingId || 0,
        actionByUserId: userData?.userId || 0,
        updatedByName: userData?.fullName || "", // Change as needed
        price: booking?.price || 0,
        priceAccount: booking?.priceAccount || 0,
        mileage: booking?.miles || 0,
        mileageText: `${booking?.miles || 0} miles`, // Convert miles to string
        durationText: "", // No duration available in provided object
      };
      let response;
      if (booking?.accNo === 10026 || booking?.accNo === 9014) {
        response = await accountPriceJobHVS(payload);
      } else {
        response = await accountPriceJobByMileage(payload);
      }
      // console.log('Response:', response);
      if (response.status === "success") {
        handleShow();
        toast.success("Price Updated");
      } else {
        toast.error("Failed to Update Price");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = async (bookingId) => {
    try {
      const response = await clearInvoice(bookingId);
      if (response?.status === "success") {
        toast.success("Invoice Cancellation Successful");
        handleShow();
      }
    } catch (error) {
      console.error("Failed to cancel invoice:", error);
      toast.error("Failed to cancel invoice");
    }
  };

  const updateCharges = async (bookingId) => {
    try {
      const payload = {
        bookingId: bookingId || 0,
        waitingMinutes: Number(bookingValues[bookingId]?.waitingMinutes) || 0,
        parkingCharge: Number(bookingValues[bookingId]?.parkingCharge) || 0,
        priceAccount: Number(bookingValues[bookingId]?.priceAccount) || 0,
        price: Number(bookingValues[bookingId]?.price) || 0,
      };

      const response = await accountUpdateChargesData(payload);

      if (response?.status === "success") {
        handleShow();
        toast.success("Value Updated");
      }
    } catch (error) {
      console.error("Error updating charges:", error);
    }
  };

  const handleInputChange = async (field, bookingId, value) => {
    setBookingValues((prev) => ({
      ...prev,
      [bookingId]: {
        ...prev[bookingId],
        [field]: value,
      },
    }));

    // Set debounced value for API call
    // setDebouncedValue({ field, bookingId, value });
  };

  const handleKeyPress = (e, nextField) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission

      // Move focus to the next input field
      if (nextField) {
        const nextInput = document.querySelector(`input[name="${nextField}"]`);
        if (nextInput) {
          nextInput.focus();
          nextInput.select(); // Select the text inside the input
        }
      }
    }
  };

  useEffect(() => {
    if (!debouncedValue) return;

    const timer = setTimeout(() => {
      updateCharges(debouncedValue.bookingId);
    }, 500); // Delay of 500ms

    return () => clearTimeout(timer);
  }, [debouncedValue]);

  const handlePostButton = async (booking) => {
    try {
      const postJob = booking?.priceAccount > 0 && true;
      const response = await accountPostOrUnpostJobs(
        postJob,
        booking?.bookingId
      );
      if (response?.status === "success") {
        toast.success("Job posted successfully");
        handleShow();
      } else {
        toast.error("Failed to post job");
      }
    } catch (error) {
      console.error("Failed to post job:", error);
      toast.error("Failed to post job");
    }
  };

  const handlePostAllPriced = async (jobs) => {
    try {
      // Filter bookings with driverFare > 0
      const jobsToPost = jobs.filter((job) => Number(job.priceAccount) > 0);

      // console.log({ formattedNotPricedBookings, jobsToPost });

      if (jobsToPost.length === 0) {
        toast.error("No jobs available to post.");
        return;
      }

      const jobsIds = jobsToPost.map((job) => job.bookingId);

      const response = await accountPostOrUnpostJobs(true, jobsIds);

      if (response.status === "success") {
        toast.success(`${jobsToPost.length} jobs posted successfully!`);
        handleShow();
      } else {
        toast.error("Some jobs failed to post.");
      }
    } catch (error) {
      console.error("Error posting all jobs:", error);
      toast.error("Failed to post all jobs.");
    }
  };

  const handleAllPriced = async (jobs) => {
    try {
      const firstJob = jobs[0];
      const bookingIds = jobs.map((job) => job.bookingId);
      const payload = {
        pickupPostcode: firstJob.pickupPostcode,
        viaPostcodes: firstJob.vias?.map((via) => via.postCode),
        destinationPostcode: firstJob.destinationPostcode,
        pickupDateTime: firstJob.date,
        passengers: firstJob.passengers,
        priceFromBase: true,
        bookingId: 999999,
        actionByUserId: userData?.userId || 0,
        updatedByName: userData?.fullName || "",
        price: firstJob?.price || 0,
        priceAccount: firstJob?.priceAccount || 0,
        mileage: firstJob?.miles || 0,
        mileageText: `${firstJob?.miles || 0} miles`, // Convert miles to string
        durationText: "", // No duration available in provided object
        bookingIds: bookingIds || [],
      };
      const response = await accountPriceJobHVSBulk(payload);
      if (response?.status === "success") {
        toast.success("All jobs priced successfully");
        handleShow();
      }
    } catch (error) {
      console.error("Error posting all jobs:", error);
      toast.error("Failed to post all jobs.");
    }
  };

  return (
    <div>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 text-start py-2 text-gray-700">
              Id #
            </th>
            <th className="border border-gray-300 px-4 text-start py-2 text-gray-700">
              Date
            </th>
            <th className="border border-gray-300 text-start px-4 py-2 text-gray-700">
              Acc #
            </th>
            <th className="border border-gray-300 text-start px-4 py-2 text-gray-700">
              Driver #
            </th>
            <th className="border border-gray-300 text-start px-4 py-2 text-gray-700">
              Pax
            </th>
            <th className="border border-gray-300 text-start px-4 py-2 text-gray-700">
              Vias
            </th>
            <th className="border border-gray-300 text-start px-4 py-2 text-gray-700">
              Waiting
            </th>
            <th className="border border-gray-300 text-start px-4 py-2 text-gray-700">
              Wait. Charge
            </th>
            <th className="border border-gray-300 text-start px-4 py-2 text-gray-700">
              Actual Miles
            </th>
            <th className="border border-gray-300 text-start px-4 py-2 text-gray-700">
              Driver
            </th>
            <th className="border border-gray-300 text-start px-4 py-2 text-gray-700">
              Journey Charge
            </th>
            <th className="border border-gray-300 text-start px-4 py-2 text-gray-700">
              Parking
            </th>
            <th className="border border-gray-300 text-start px-4 py-2 text-gray-700">
              Total
            </th>
            <th className="border border-gray-300 text-start px-4 py-2 text-gray-700">
              Price
            </th>
            <th className="border border-gray-300 text-start px-4 py-2 text-gray-700">
              Post
            </th>
            <th className="border border-gray-300 text-start px-4 py-2 text-gray-700">
              Cancel
            </th>
          </tr>
        </thead>
        <tbody>
          {notPriced
            ?.slice(
              currentPagePassenger * itemsPerPagePassenger,
              (currentPagePassenger + 1) * itemsPerPagePassenger
            )
            ?.map((passengerData, passengerIndex) => (
              <React.Fragment key={`passenger-${passengerIndex}`}>
                <tr
                  className="bg-gray-100 cursor-pointer"
                  onClick={() => togglePassenger(passengerData.passenger)}
                >
                  <td
                    colSpan="16"
                    className="border border-gray-300 px-4 py-2 font-semibold"
                  >
                    <span className="-ms-1 text-gray-700">
                      {expandedPassengers[passengerData.passenger] ? (
                        <KeyboardArrowDownIcon />
                      ) : (
                        <KeyboardArrowRightIcon />
                      )}{" "}
                      {passengerData.passenger}
                    </span>
                  </td>
                </tr>
                {expandedPassengers[passengerData.passenger] &&
                  passengerData.pickupGroups?.map(
                    (pickupGroup, pickupIndex) => (
                      <React.Fragment key={`pickup-${pickupIndex}`}>
                        <tr
                          className="bg-gray-100 cursor-pointer"
                          onClick={() =>
                            togglePickupGroup(
                              passengerData.passenger,
                              pickupGroup.pickup
                            )
                          }
                        >
                          <td
                            colSpan="16"
                            className="border border-gray-300 px-4 py-2 font-semibold"
                          >
                            <span className="-ms-1 ml-3 text-gray-700">
                              {expandedPickupGroups[
                                `${passengerData.passenger}-${pickupGroup.pickup}`
                              ] ? (
                                <KeyboardArrowDownIcon />
                              ) : (
                                <KeyboardArrowRightIcon />
                              )}{" "}
                              {pickupGroup.pickup}
                            </span>
                          </td>
                        </tr>
                        {expandedPickupGroups[
                          `${passengerData.passenger}-${pickupGroup.pickup}`
                        ] &&
                          pickupGroup.destinationGroups?.map(
                            (destinationGroup, destinationIndex) => (
                              <React.Fragment
                                key={`destination-${destinationIndex}`}
                              >
                                <tr
                                  className="bg-gray-100 cursor-pointer"
                                  onClick={() =>
                                    toggleDestinationGroup(
                                      passengerData.passenger,
                                      pickupGroup.pickup,
                                      destinationGroup.destination
                                    )
                                  }
                                >
                                  <td
                                    colSpan="16"
                                    className="border border-gray-300 px-4 py-2 font-semibold"
                                  >
                                    <div className="flex justify-start items-center gap-2">
                                      <span className="-ms-1 ml-6 text-gray-700">
                                        {expandedDestinationGroups[
                                          `${passengerData.passenger}-${pickupGroup.pickup}-${destinationGroup.destination}`
                                        ] ? (
                                          <KeyboardArrowDownIcon />
                                        ) : (
                                          <KeyboardArrowRightIcon />
                                        )}{" "}
                                        {" "}
                                        {destinationGroup.destination}
                                      </span>
                                      <button
                                        className="btn btn-primary bg-green-600 flex justify-center"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleAllPriced(
                                            destinationGroup.jobs
                                          );
                                        }}
                                      >
                                        Price All
                                      </button>
                                      <button
                                        className="btn btn-primary flex justify-center"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handlePostAllPriced(
                                            destinationGroup.jobs
                                          );
                                        }}
                                      >
                                        Post All Priced
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                                {expandedDestinationGroups[
                                  `${passengerData.passenger}-${pickupGroup.pickup}-${destinationGroup.destination}`
                                ] && (
                                  <>
                                    {destinationGroup.jobs
                                      ?.slice(
                                        currentPage * itemsPerPage,
                                        (currentPage + 1) * itemsPerPage
                                      )
                                      ?.map((booking) => (
                                        <tr
                                          key={`booking-${booking.bookingId}`}
                                          className={`${booking?.coa ? " bg-orange-500 hover:bg-orange-400" : "bg-white dark:bg-[#14151A] hover:bg-gray-100"} border-t`}
                                        >
                                          <td className="border border-gray-300 px-4 py-2">
                                            {booking.bookingId}
                                          </td>
                                          <td className="border border-gray-300 px-4 py-2">
                                            {booking.date
                                              ? new Date(
                                                  booking.date
                                                ).toLocaleDateString("en-GB") +
                                                " " +
                                                booking.date
                                                  .split("T")[1]
                                                  .slice(0, 5)
                                              : "N/A"}
                                          </td>
                                          <td className="border border-gray-300 px-4 py-2">
                                            {booking.accNo}
                                          </td>
                                          <td className="border border-gray-300 px-4 py-2">
                                            {booking.userId}
                                          </td>
                                          <td className="border border-gray-300 px-4 py-2">
                                            {booking.passengers}
                                          </td>
                                          <td className="border border-gray-300 px-4 py-2">
                                            {(booking.vias.length > 0 &&
                                              booking.vias
                                                .map((via) => via.address)
                                                .join(", ")) ||
                                              "-"}
                                          </td>
                                          <td className="border border-gray-300 px-4 py-2">
                                            {
                                              <input
                                                type="number"
                                                className="w-20 text-center border rounded p-1 bg-inherit ring-inherit dark:bg-inherit dark:ring-inherit"
                                                name={`waitingMinutes-${booking.bookingId}`}
                                                value={
                                                  bookingValues[
                                                    booking.bookingId
                                                  ]?.waitingMinutes || 0
                                                }
                                                onChange={(e) =>
                                                  handleInputChange(
                                                    "waitingMinutes",
                                                    booking.bookingId,
                                                    e.target.value
                                                  )
                                                }
                                                onBlur={(e) =>
                                                  setDebouncedValue({
                                                    field: "waitingMinutes",
                                                    bookingId:
                                                      booking.bookingId,
                                                    value: e.target.value,
                                                  })
                                                }
                                                onKeyDown={(e) =>
                                                  handleKeyPress(
                                                    e,
                                                    `price-${booking.bookingId}`
                                                  )
                                                }
                                                onFocus={(e) =>
                                                  e.target.select()
                                                }
                                              />
                                            }
                                          </td>
                                          <td className="border border-gray-300 px-4 py-2">
                                            £
                                            {booking?.waitingPriceAccount?.toFixed(
                                              2
                                            ) || "0.00"}
                                          </td>
                                          <td className="border border-gray-300 px-4 py-2">
                                            {booking.miles?.toFixed(1) || "0.0"}
                                          </td>
                                          <td className="border border-gray-300 px-4 py-2">
                                            {
                                              <input
                                                type="number"
                                                step="0.01"
                                                className="w-20 text-center border rounded p-1 bg-inherit ring-inherit dark:bg-inherit dark:ring-inherit"
                                                value={
                                                  bookingValues[
                                                    booking.bookingId
                                                  ]?.price || 0
                                                }
                                                name={`price-${booking.bookingId}`}
                                                onChange={(e) =>
                                                  handleInputChange(
                                                    "price",
                                                    booking.bookingId,
                                                    e.target.value
                                                  )
                                                }
                                                onBlur={(e) =>
                                                  setDebouncedValue({
                                                    field: "price",
                                                    bookingId:
                                                      booking.bookingId,
                                                    value: e.target.value,
                                                  })
                                                }
                                                onKeyDown={(e) =>
                                                  handleKeyPress(
                                                    e,
                                                    `priceAccount-${booking.bookingId}`
                                                  )
                                                }
                                                onFocus={(e) =>
                                                  e.target.select()
                                                }
                                              />
                                            }
                                          </td>
                                          <td className="border border-gray-300 px-4 py-2">
                                            <input
                                              type="number"
                                              step="0.01"
                                              className="w-20 text-center border rounded p-1 bg-inherit ring-inherit dark:bg-inherit dark:ring-inherit"
                                              name={`priceAccount-${booking.bookingId}`}
                                              value={
                                                bookingValues[booking.bookingId]
                                                  ?.priceAccount || 0
                                              }
                                              onChange={(e) =>
                                                handleInputChange(
                                                  "priceAccount",
                                                  booking.bookingId,
                                                  e.target.value
                                                )
                                              }
                                              onBlur={(e) =>
                                                setDebouncedValue({
                                                  field: "priceAccount",
                                                  bookingId: booking.bookingId,
                                                  value: e.target.value,
                                                })
                                              }
                                              onKeyDown={(e) =>
                                                handleKeyPress(
                                                  e,
                                                  `parkingCharge-${booking.bookingId}`
                                                )
                                              }
                                              onFocus={(e) => e.target.select()}
                                            />
                                          </td>
                                          <td className="border border-gray-300 px-4 py-2">
                                            <input
                                              type="number"
                                              step="0.01"
                                              className="w-20 text-center border rounded p-1 bg-inherit ring-inherit dark:bg-inherit dark:ring-inherit"
                                              value={
                                                bookingValues[booking.bookingId]
                                                  ?.parkingCharge || 0
                                              }
                                              name={`parkingCharge-${booking.bookingId}`}
                                              onChange={(e) =>
                                                handleInputChange(
                                                  "parkingCharge",
                                                  booking.bookingId,
                                                  e.target.value
                                                )
                                              }
                                              onBlur={(e) =>
                                                setDebouncedValue({
                                                  field: "parkingCharge",
                                                  bookingId: booking.bookingId,
                                                  value: e.target.value,
                                                })
                                              }
                                              onKeyDown={(e) =>
                                                handleKeyPress(e, null)
                                              }
                                              onFocus={(e) => e.target.select()}
                                            />
                                          </td>
                                          <td className="border border-gray-300 px-4 py-2">
                                            £
                                            {(
                                              Number(
                                                bookingValues[booking.bookingId]
                                                  .parkingCharge || 0
                                              ) +
                                              Number(
                                                booking?.waitingPriceAccount ||
                                                  0
                                              ) +
                                              Number(
                                                bookingValues[booking.bookingId]
                                                  .priceAccount || 0
                                              )
                                            ).toFixed(2)}
                                          </td>
                                          <td className="border border-gray-300 px-4 py-2">
                                            <MoneyIcon
                                              className={`${booking?.coa ? "text-green-600 dark:text-green-600" : "text-green-500 dark:text-green-400"} cursor-pointer`}
                                              onClick={() => {
                                                handlePriceFromBaseButton(
                                                  booking
                                                );
                                              }}
                                            />
                                          </td>
                                          <td className="border border-gray-300 px-4 py-2">
                                            <EmailOutlined
                                              className={`${booking?.coa ? `${booking.postedForInvoicing ? "text-red-500 dark:text-red-900" : "text-blue-500 dark:text-white"}` : `${booking.postedForInvoicing ? "text-red-500 dark:text-red-600" : "text-blue-500 dark:text-cyan-400"}`} cursor-pointer `}
                                              onClick={() => {
                                                if (
                                                  bookingValues[
                                                    booking.bookingId
                                                  ].priceAccount === 0
                                                ) {
                                                  toast.error(
                                                    "Journey Charge Should not be 0"
                                                  ); // Show error if price is 0
                                                } else {
                                                  handlePostButton(booking); // Post the job if valid
                                                }
                                              }}
                                            />
                                          </td>
                                          <td className="border border-gray-300 px-4 py-2">
                                            <DeleteOutlinedIcon
                                              className="text-red-500 dark:text-red-600 cursor-pointer"
                                              onClick={() =>
                                                handleCancel(booking.bookingId)
                                              }
                                            />
                                          </td>
                                        </tr>
                                      ))}
                                    {destinationGroup.jobs?.length >
                                      itemsPerPage && (
                                      <tr>
                                        <td
                                          colSpan="16"
                                          className="border border-gray-300 px-4 py-2"
                                        >
                                          <div className="flex justify-end items-center gap-2">
                                            <div>
                                              Showing{" "}
                                              {currentPage * itemsPerPage + 1} -{" "}
                                              {Math.min(
                                                (currentPage + 1) *
                                                  itemsPerPage,
                                                destinationGroup.jobs.length
                                              )}{" "}
                                              of {destinationGroup.jobs.length}{" "}
                                              jobs
                                            </div>
                                            <div className="flex space-x-2">
                                              <button
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setCurrentPage((prev) =>
                                                    Math.max(prev - 1, 0)
                                                  );
                                                }}
                                                disabled={currentPage === 0}
                                                className="px-1 py-1 border rounded-full disabled:opacity-50"
                                              >
                                                <KeyboardArrowLeftIcon />
                                              </button>
                                              <button
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setCurrentPage((prev) =>
                                                    (prev + 1) * itemsPerPage <
                                                    destinationGroup.jobs.length
                                                      ? prev + 1
                                                      : prev
                                                  );
                                                }}
                                                disabled={
                                                  (currentPage + 1) *
                                                    itemsPerPage >=
                                                  destinationGroup.jobs.length
                                                }
                                                className="px-1 py-1 border rounded-full disabled:opacity-50"
                                              >
                                                <KeyboardArrowRightIcon />
                                              </button>
                                            </div>
                                          </div>
                                        </td>
                                      </tr>
                                    )}
                                  </>
                                )}
                              </React.Fragment>
                            )
                          )}
                      </React.Fragment>
                    )
                  )}
              </React.Fragment>
            ))}
        </tbody>
      </table>
      {notPriced?.length > itemsPerPagePassenger && (
        <div>
          <div colSpan="16" className="border border-gray-300 px-4 py-2">
            <div className="flex justify-end items-center gap-2">
              <div>
                Showing {currentPagePassenger * itemsPerPagePassenger + 1} -{" "}
                {Math.min(
                  (currentPagePassenger + 1) * itemsPerPagePassenger,
                  notPriced.length
                )}{" "}
                of {notPriced.length} passengers
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentPagePassenger((prev) => Math.max(prev - 1, 0));
                  }}
                  disabled={currentPagePassenger === 0}
                  className="px-1 py-1 border rounded-full disabled:opacity-50"
                >
                  <KeyboardArrowLeftIcon />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentPagePassenger((prev) =>
                      (prev + 1) * itemsPerPagePassenger < notPriced.length
                        ? prev + 1
                        : prev
                    );
                  }}
                  disabled={
                    (currentPagePassenger + 1) * itemsPerPagePassenger >=
                    notPriced.length
                  }
                  className="px-1 py-1 border rounded-full disabled:opacity-50"
                >
                  <KeyboardArrowRightIcon />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
