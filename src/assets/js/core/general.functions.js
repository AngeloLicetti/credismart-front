$.fn.dataTable.ext.errMode = 'throw';
$.extend(true, $.fn.dataTable.defaults, {
    searching: false,
    lengthChange: false,
    ordering: false,
    pagingType: "full_numbers",
    lengthMenu: [[10, 25, 50/*, -1*/], [10, 25, 50/*, "Todos"*/]],
    /*
    responsive: {
         details: {
             display: $.fn.dataTable.Responsive.display.childRowImmediate,
             type: ''
         }
    },
    */
    processing:true,
    responsive: true,
    // pageLength: 10,
    language: {
        sUrl: "assets/media/language/Spanish.json",
        search: "_INPUT_",
        searchPlaceholder: "Buscar Registros",


    }/*,
    ajax: {
        error: function (xhr, error, thrown) {
            console.log(xhr);
            if (xhr && xhr.responseJSON && xhr.responseJSON.error && xhr.responseJSON.error === "invalid_token")
                oNavbarComponent.logout();
            else {
                console.error(xhr, error, thrown);
            }
        },
    }*/



});
var GeneralFunctions = new function () {
    this.registerCheckAll = function () {

        jQuery('.material-datatables .table').on('click', '.checkall', function (event) {
            // console.log(event.delegateTarget);
            if (event.target.checked) {
                jQuery(event.delegateTarget).find(':checkbox').prop("checked", true);
            } else {
                jQuery(event.delegateTarget).find(':checkbox').prop("checked", false);
            }
        });
    };
    this.FormatNumber = function (value, fractionSize = 4) {
        var PADDING = "000000";
        var DECIMAL_SEPARATOR = ".";
        var THOUSANDS_SEPARATOR = ",";
        if (value == 0)
            return '0.0000';
        if (!value)
            return '';
        var [integer, fraction = ""] = (value || "").toString()
            .split(DECIMAL_SEPARATOR);

        fraction = fractionSize > 0
            ? DECIMAL_SEPARATOR + (fraction + PADDING).substring(0, fractionSize)
            : "";

        integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, THOUSANDS_SEPARATOR);

        return integer + fraction;
    };
    this.ErrorMessage = function (){

       

        return 'Al parecer ocurrió un error. Contáctese con el Administrador del Sistema';
    };
    this.newUUID = function () {

        // http://www.ietf.org/rfc/rfc4122.txt
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";
        return s.join("");
    };
    this.ModalSettings = function () {
        $(function () {
            function reposition() {
                var modal = $(this),
                    dialog = modal.find('.modal-dialog');
                modal.css('display', 'block');
    
                // Dividing by two centers the modal exactly, but dividing by three
                // or four works better for larger screens.
                dialog.css("margin-top", Math.max(0, ($(window).height() - dialog.height()) / 2));
            }
            // Reposition when a modal is shown
            $('.modal').on('show.bs.modal', reposition);
            // Reposition when the window is resized
            $(window).on('resize', function () {
                $('.modal:visible').each(reposition);
            });
        });
        $('.modal-dialog').draggable({
            handle: ".modal-header"
        });
    };
    this.ConvertStringToDatetime = function (fecha) {
        //var fecha = '16/12/2017';
        if (fecha && fecha != '')
            return moment(fecha,'YYYY-MM-DD HH:mm:ss.SSS').toDate();
        else return null;
    };
    this.ConvertStringToTime = function (fecha) {
        //var fecha = '16/12/2017';
        if (fecha && fecha != ''){

            var fecha_dt= moment(fecha,'YYYY-MM-DD HH:mm:ss.SSS').toDate();
            return  moment(fecha_dt).format('hh:mm A');
        }
            
        else return null;
    };
    this.ConvertStringDatimeToDateTimeFormat = function (fecha) {
        //var fecha = '16/12/2017';
        if (fecha && fecha != ''){

            var fecha_dt= moment(fecha,'YYYY-MM-DD HH:mm:ss.SSS').toDate();
            return  moment(fecha_dt).format('DD-MM-YYYY hh:mm A');
        }
            
        else return null;
    };
    this.FormatDatetimeForMicroService = function (fecha) {
        if (fecha &&fecha != '')
        return moment(fecha).format('YYYY-MM-DD HH:mm:ss.SSS');
        //return moment(fecha).format('YYYY-MM-DD');
        else return '';
    };

    this.FormatDateForMicroService = function (fecha) {
        if (fecha &&fecha != '')
        return moment(fecha).format('YYYY-MM-DD');
        //return moment(fecha).format('YYYY-MM-DD');
        else return '';
    };
    this.FormatDatetimeForMicroServiceHHMM  = function (fecha, hora) {
        if (fecha &&fecha != ''){
            var fecha_str= moment(fecha).format('YYYY-MM-DD')+ ' '+ hora;
            var fecha_dt= moment(fecha_str,'YYYY-MM-DD hh:mm A').toDate();
            return moment(fecha_dt).format('YYYY-MM-DD HH:mm:ss.SSS');
        }
      
        //return moment(fecha).format('YYYY-MM-DD');
        else return '';
    };
}

