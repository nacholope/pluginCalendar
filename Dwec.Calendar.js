(function ($) {
  if (!$.Dwec) {
    $.Dwec = new Object();
  };
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
      base.renderCalendar();
    };

    /*base.getEvents = function(){
      $.ajax({
        method : "GET",
        url: base.options.url,
        statusCode: {
          404: function() {
            alert( base.options.msgError );
          }
        }
      }).done(function(data){
          base.options.eventsJson=data;
          console.log(base.options.eventsJson);
      });
    };*/

    base.renderCalendar = function(){
      $(el).fullCalendar({
        events: function (start, end, timezone, callback) {
          $.ajax({
            url: base.options.url,
            dataType: 'json',
            data: {
              // our hypothetical feed requires UNIX timestamps
              start: start.unix(),
              end: end.unix()
            },
            success: function (doc) {
              //$.each(doc,function(key , val){
              //toastr.success(val.start, val.title);
              //})
              var events = [];
              for (var item in doc) {
                events.push({
                  title: doc[item]['description'],
                  start: doc[item]['startDate'],
                  end: doc[item]['endDate'],
                  allDay: true
                })
              }
              callback(events);
            },
            error : function (doc) {
              toastr.error("La peticion ajax ha fallado");
            }
          });
        }
      });

      $("#event_add").click(function () {
        toastr.success("Todo OK!!", "Notifications");
      });
    };

    base.init();
  };
  $.Dwec.Calendar.defaultOptions = {
    html: true,
    url : "http://tomcat7-mycoachgate.rhcloud.com/rest/events/get/",
    msgError: "Content not found",
    eventsJson: {}
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
