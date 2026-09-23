import { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import {
  format,
  parse,
  startOfWeek,
  getDay,
} from "date-fns";

import {
  ToastContainer,
  toast,
} from "react-toastify";

import { enUS } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

import { X } from "lucide-react";


import "react-toastify/dist/ReactToastify.css";

import {
  getShoots,
  deleteShoot,
} from "../../services/shootService";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "./Shoots.css";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

function ShootCalendar() {
  const navigate = useNavigate();

  const [shoots, setShoots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedShoot, setSelectedShoot] =
    useState(null);

  // Calendar ki current visible date
  const [calendarDate, setCalendarDate] =
    useState(new Date());

    const [calendarView, setCalendarView] =
  useState("month");

  useEffect(() => {
    const loadShoots = async () => {
      try {
        const data = await getShoots();

        setShoots(
          data.shoots ||
            data.data ||
            []
        );
      } catch (error) {
        console.error(
          "Get shoots error:",
          error
        );

        toast.error(
          error.response?.data?.message ||
            "Failed to load shoots"
        );
      } finally {
        setLoading(false);
      }
    };

    loadShoots();
  }, []);

  const formatShootDateTime = (
    shootDate,
    time
  ) => {
    if (!shootDate || !time) {
      return null;
    }

    const date = new Date(shootDate);

    const [hours, minutes] =
      time.split(":").map(Number);

    date.setHours(
      hours,
      minutes,
      0,
      0
    );

    return date;
  };

  const calendarEvents = shoots
    .map((shoot) => {
      const start = formatShootDateTime(
        shoot.shootDate,
        shoot.startTime
      );

      const end = formatShootDateTime(
        shoot.shootDate,
        shoot.endTime
      );

      if (!start || !end) {
        return null;
      }

      return {
        id: shoot._id,
        title:
          shoot.creator?.name ||
          "Shoot",
        start,
        end,
        resource: shoot,
      };
    })
    .filter(Boolean);

  const handleSelectEvent = (event) => {
    setSelectedShoot(event.resource);
  };

const handleDelete = () => {
  if (!selectedShoot?._id) {
    return;
  }

  toast(
    ({ closeToast }) => (
      <div>
        <p style={{ margin: "0 0 12px" }}>
          Are you sure you want to delete this shoot?
        </p>

        <div
          style={{
            display: "flex",
            gap: "8px",
          }}
        >
          <button
            type="button"
            onClick={async () => {
              try {
                await deleteShoot(
                  selectedShoot._id
                );

                setShoots((prev) =>
                  prev.filter(
                    (shoot) =>
                      shoot._id !==
                      selectedShoot._id
                  )
                );

                setSelectedShoot(null);
                closeToast();

                toast.success(
                  "Shoot deleted successfully"
                );
              } catch (error) {
                console.error(
                  "Delete shoot error:",
                  error
                );

                closeToast();

                toast.error(
                  error.response?.data?.message ||
                    "Failed to delete shoot"
                );
              }
            }}
            style={{
              border: "none",
              borderRadius: "6px",
              padding: "7px 12px",
              background: "#dc2626",
              color: "#fff",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Confirm Delete
          </button>

          <button
            type="button"
            onClick={closeToast}
            style={{
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              padding: "7px 12px",
              background: "#fff",
              color: "#374151",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    ),
    {
      autoClose: false,
      closeOnClick: false,
      closeButton: false,
    }
  );
};

  const formatStatus = (status) => {
    return (
      status
        ?.replace(/_/g, " ")
        .replace(/\b\w/g, (char) =>
          char.toUpperCase()
        ) || "-"
    );
  };

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return format(
      new Date(date),
      "dd MMMM yyyy"
    );
  };

  const eventStyleGetter = (
    event
  ) => {
    const status =
      event.resource?.status;

    let backgroundColor =
      "#4f46e5";

    if (status === "confirmed") {
      backgroundColor = "#2563eb";
    }

    if (status === "in_progress") {
      backgroundColor = "#d97706";
    }

    if (status === "completed") {
      backgroundColor = "#16a34a";
    }

    if (status === "cancelled") {
      backgroundColor = "#dc2626";
    }

    return {
      style: {
        backgroundColor,
        borderRadius: "6px",
        border: "none",
        color: "#ffffff",
        fontSize: "12px",
        fontWeight: "600",
        padding: "4px 7px",
      },
    };
  };

  return (
    <div className="shoots-page">
      <div className="shoots-header">
        <div>
          <h1>Shoot Calendar</h1>

          <p>
            Manage and schedule all your
            shoots • {shoots.length}{" "}
            {shoots.length === 1
              ? "shoot"
              : "shoots"}
          </p>
        </div>

        <button
          type="button"
          className="add-shoot-button"
          onClick={() =>
            navigate("/shoots/add")
          }
        >
          Add Shoot
        </button>
      </div>

      {loading ? (
        <div className="shoots-empty">
          <p>
            Loading shoot calendar...
          </p>
        </div>
      ) : shoots.length === 0 ? (
        <div className="shoots-empty">
          <h2>No Shoots Found</h2>

          <p>
            Add your first shoot to start
            managing your shoot schedule.
          </p>

          <button
            type="button"
            className="add-shoot-button"
            onClick={() =>
              navigate("/shoots/add")
            }
          >
            Add First Shoot
          </button>
        </div>
      ) : (
        <>
          <div className="shoot-calendar-card">
            <Calendar
              localizer={localizer}
              events={calendarEvents}
              startAccessor="start"
              endAccessor="end"
              titleAccessor="title"

              // Current visible calendar date
              date={calendarDate}

              // Back / Next / Today navigation
              onNavigate={(newDate) =>
                setCalendarDate(newDate)
              }
view={calendarView}
onView={(newView) =>
  setCalendarView(newView)
}
views={[
  "month",
  "week",
  "day",
  "agenda",
]}
              popup
              selectable={false}
              onSelectEvent={
                handleSelectEvent
              }
              eventPropGetter={
                eventStyleGetter
              }
              style={{
                height: 700,
              }}
            />
          </div>

          <div className="shoot-calendar-mobile-list">
            {shoots.map((shoot) => (
              <div
                className="shoot-mobile-item"
                key={shoot._id}
              >
                <div>
                  <strong>
                    {shoot.client
                      ?.companyName ||
                      "Unknown Client"}
                  </strong>

                  <span>
                    {formatDate(
                      shoot.shootDate
                    )}
                  </span>

                  <span>
                    {shoot.startTime ||
                      "-"}{" "}
                    -{" "}
                    {shoot.endTime ||
                      "-"}
                  </span>

                  <span>
                    {shoot.creator
                      ?.name ||
                      "Unknown Creator"}
                  </span>
                </div>

                <div className="shoot-mobile-actions">
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedShoot(
                        shoot
                      )
                    }
                  >
                    View
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/shoots/${shoot._id}`
                      )
                    }
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedShoot(
                        shoot
                      )
                    }
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {selectedShoot && (
        <div
          className="shoot-modal-overlay"
          onClick={() =>
            setSelectedShoot(null)
          }
        >
          <div
            className="shoot-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <div className="shoot-modal-header">
              <div>
                <h2>
                  Shoot Details
                </h2>

                <p>
                  {selectedShoot.creator
                    ?.name ||
                    "Shoot"}
                </p>
              </div>

              <button
                type="button"
                className="shoot-modal-close"
                onClick={() =>
                  setSelectedShoot(
                    null
                  )
                }
              >
                <X size={20} />
              </button>
            </div>

            <div className="shoot-modal-content">
              <div className="shoot-modal-grid">
                <div>
                  <span>Client</span>

                  <strong>
                    {selectedShoot.client
                      ?.companyName ||
                      "-"}
                  </strong>
                </div>

                <div>
                  <span>Order</span>

                  <strong>
                    {selectedShoot.order
                      ?.packageName ||
                      "-"}
                  </strong>
                </div>

                <div>
                  <span>Creator</span>

                  <strong>
                    {selectedShoot.creator
                      ?.name ||
                      "-"}
                  </strong>
                </div>

                <div>
                  <span>Date</span>

                  <strong>
                    {formatDate(
                      selectedShoot.shootDate
                    )}
                  </strong>
                </div>

                <div>
                  <span>Time</span>

                  <strong>
                    {selectedShoot.startTime ||
                      "-"}{" "}
                    -{" "}
                    {selectedShoot.endTime ||
                      "-"}
                  </strong>
                </div>

                <div>
                  <span>Location</span>

                  <strong>
                    {selectedShoot.location ||
                      "-"}
                  </strong>
                </div>

                <div>
                  <span>Status</span>

                  <strong>
                    {formatStatus(
                      selectedShoot.status
                    )}
                  </strong>
                </div>
              </div>

              <div className="shoot-modal-notes">
                <span>Notes</span>

                <p>
                  {selectedShoot.notes ||
                    "No notes available."}
                </p>
              </div>
            </div>

            <div className="shoot-modal-actions">
              <button
                type="button"
                className="shoot-modal-view"
                onClick={() =>
                  navigate(
                    `/shoots/view/${selectedShoot._id}`
                  )
                }
              >
                View
              </button>

              <button
                type="button"
                className="shoot-modal-edit"
                onClick={() =>
                  navigate(
                    `/shoots/${selectedShoot._id}`
                  )
                }
              >
                Edit
              </button>

              <button
                type="button"
                className="shoot-modal-delete"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />
    </div>
  );
}

export default ShootCalendar;