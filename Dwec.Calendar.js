(function ($) {
  if (!$.Dwec) {
    $.Dwec = new Object();
  }
  ;
  $.Dwec.Calendar = function (el, getData, options) {
    // To avoid scope issues, use 'base' instead of 'this'
    // to reference this class from internal events and functions.
    var base = this;
    // Access to jQuery and DOM versions of element
    base.$el = $(el);
    base.el = el;
    // Add a reverse reference to the DOM object
    base.$el.data("Dwec.Calendar", base);
    base.init = function () {
      base.getData = getData;
      base.options = $.extend({}, $.Dwec.Calendar.defaultOptions, options);
      // Put your initialization code here
      base.renderGenericEvents();
      base.renderCalendar();
      base.onDragOverDays();
    };

    base.onDragOverDays = function () {
      $('.fc-day').each(function (key, value) {
        $(this).on("dragover", function (event) {
          event.preventDefault();
          event.stopPropagation();
          $(this).addClass('dragging');
          this.style.backgroundColor = 'rgba(23,23,23,0.5)';
        });

        $(this).on("dragleave", function (event) {
          event.preventDefault();
          event.stopPropagation();
          $(this).removeClass('dragging');
          this.style.backgroundColor = 'rgba(255,255,255,1)';
        });

        $(this).on("drop", function (event) {
          event.preventDefault();
          event.stopPropagation();
          this.style.backgroundColor = 'rgba(255,255,255,1)';
          var fecha = this.getAttribute('data-date');
          var myEvent = {
            title: "Nuevo evento",
            allDay: true,
            start: fecha,
            end: fecha
          };

          $.ajax({
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            url: 'http://tomcat7-mycoachgate.rhcloud.com/rest/events/add/',
            method: "POST",
            dataType: 'json',
            data: JSON.stringify({
              "name": "Evento Prueba drag",
              "description": "Prueba drag",
              "startDate": fecha,
              "content": {"attr1": 1, "attr2": "2"}
            }),
            statusCode: {
              200: function (response) {
                $(el).fullCalendar('renderEvent', myEvent);
              },
              201: function (response) {
                toastr.success("Evento añadido", "Evento dia " + fecha);
                $(el).fullCalendar('renderEvent', myEvent);
              },
              400: function (response) {
                $(el).fullCalendar('renderEvent', myEvent);
              },
              404: function (response) {
                $(el).fullCalendar('renderEvent', myEvent);
              }
            }, success: function () {
              $(el).fullCalendar('renderEvent', myEvent);
            }
          });
        });
      });
    };
    base.renderGenericEvents = function () {
      var divEvents = '<div style="position: relative;" class="{classes}" {attr}>{name}</div>';
      var classes = 'external-event label label-default ui-draggable ui-draggable-handle';
      var attr = ' ondragstart="console.log(event)" draggable="true"';

      var $box = $('#event_box');
      $box.append(divEvents.replace("{classes}", classes).replace('{attr}', attr).replace("{name}", "Cumpleaños"));
      $box.append(divEvents.replace("{classes}", classes).replace('{attr}', attr).replace("{name}", "Reunion"));
      $box.append(divEvents.replace("{classes}", classes).replace('{attr}', attr).replace("{name}", "Presentacion"));
      $box.append(divEvents.replace("{classes}", classes).replace('{attr}', attr).replace("{name}", "Comida"));
      $box.append(divEvents.replace("{classes}", classes).replace('{attr}', attr).replace("{name}", "Fiesta"));
      $box.append(divEvents.replace("{classes}", classes).replace('{attr}', attr).replace("{name}", "Vacaciones"));

    };
    base.renderCalendar = function () {
      $(el).fullCalendar({
        header:{
          left:'title',center:'month,agendaWeek',right:'today prev,next'
        },
        events: function (start, end, timezone, callback) {
          $.ajax({
            url: 'scripts/statics-events.json',
            dataType: 'json',
            data: {
              start: start.unix(),
              end: end.unix()
            },
            success: function (doc) {
              var events = [];
              for (var item in doc) {
                events.push({title: doc[item]['title'], start: doc[item]['start'], allDay: true})
              }
              callback(events);
            },
            error: function (doc) {
              toastr.error("La petición ajax ha fallado");
            }
          });
        },
        eventRender: function (event, element) {
        }
      });
      $("#event_add").click(function () {
        toastr.success("Todo OK!!", "Notifications");
      });
    };

    base.init();
  };
  $.Dwec.Calendar.defaultOptions = {
    html: true
  };
  $.fn.Dwec_Calendar = function (getData, options) {
    return this.each(function () {
      (new $.Dwec.Calendar(this, getData, options));
    });
  };
  // This function breaks the chain, but returns
  // the myCorp.Calendar if it has been attached to the object.
  $.fn.getDwec_Calendar = function () {
    this.data("Dwec.Calendar");
  };
})(jQuery);
