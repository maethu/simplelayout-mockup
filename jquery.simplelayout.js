/*********************************************************
***** jQuery Simplelayout Version 1.0 (unreleased)       *
***** Based on jquery.masonry, ui.resizeable ui.sortable *
*********************************************************/

(function($){
    
    $.fn.simplelayout = function(options){
        // "this" is the container where all the magic happens
        
        // Defaults extended by given options
        var settings = $.extend({
            'sortable': '#sortable',
            'columns': 16, // deco.gs default
            'offset': 0, // amount of cells
            'minWidth': 2, // amount of cells
            'minHeightEm': 2
        }, options);

        var $container = this;

        // Possible grid widths in %, taken from deco.gs
        px_widths = [];
        var GRID_WIDTHS = [
            4.16667,
            10.41667,
            16.66667,
            22.91667,
            29.16667,
            35.41667,
            41.66667,
            47.91667,
            54.16667,
            60.41667,
            66.66667,
            72.91667,
            79.16667,
            85.41667,
            91.66667,
            97.91667];
        
        // Helper methods
        function goMason(){
            $($container).masonry({
                columnWidth: 1,
                itemSelector: '.masonry'
            });
        }

        function transform_percent_px(){
            maxwidth = $container.width(); //correct table width
            for(i in GRID_WIDTHS.slice(0,settings.columns)){
                px_widths.push(maxwidth/100*GRID_WIDTHS[i]);
            }
        }
        function getOneCellWidth(){
            // As defined in Deco.gs, 1 cells == 4.16667%
            return $($container).width() * 0.0416667;
        }
        function getGridHeight(){
            // 1em in px
            return $($container).css('font-size').slice(0,2); //cut off px
        }

        function getGridMaxWidth(){
            var diff  = 0;
            if (settings.columns !== 16){
                diff = GRID_WIDTHS.length - settings.columns;
                return $container.width() / 100 * GRID_WIDTHS[GRID_WIDTHS.length -1 - diff];
            }
            return $container.width();
        }

        function getPositionInParent(element) {
            return element.index();
        }

        //Here's a generalized version, taken from: http://www.weask.us/entry/finding-closest-number-array
        function getClosest(array,desiredNumber){
            var closest = null;
            $.each(array, function(){
              if (closest == null || Math.abs(this - desiredNumber) < Math.abs(closest - desiredNumber)) {
                closest = this;
              }
            });
            return Number(closest);
        }

        // Start doing something
        return this.each(function() {
            // Make items sortable
            $(settings.sortable).sortable({
                placeholder: {
                    element: function(currentItem) {
                        return $("<li class='masonry placeholder' style='height: " + (currentItem.height()-2) + "px; width: " + (currentItem.width()-2) +"px;'></li>")[0];
                    },
                    update: function(container, p) {
                        // Update needs to be defined...
                        return;
                    }
                },
                tolerance: 'pointer',
                items: 'li',
                opacity: 0.6,
                handle: '#boxlabel',
                helper: function(event, element) {
                    var clone = $(element).clone();
                    clone.removeClass('masonry');
                    element.removeClass('masonry');
                    return clone;
                },
                stop: function(event,ui){
                    ui.item.addClass("masonry");
                    goMason();
                    ui.item.parent().find('#boxlabel span.position').each(function(i, o){
                        var el = $(o).closest('li');
                        $(o).html(getPositionInParent(el)+1);
                    });


                },
                sort: function(){
                    goMason();
                }
            }).disableSelection();

            $(settings.sortable).children('li').each(function(){    
                $(this).resizable({
                    resize: function(event, ui) {
                        goMason();            
                        // Dynimcally change grid - use var px_widths
                        var width = ui.size.width;
                        var closest = getClosest(px_widths, width);
                        var prev = px_widths[px_widths.indexOf(closest) - 1];
                        //console.info(parseFloat(closest));
                        var space = null;
                        //finally set new grid
                        ui.element.resizable("option", "grid", [closest - prev, getGridHeight()]);
                        ui.element.find('#boxlabel span.cells').html(" ("+(px_widths.indexOf(closest)+1)+")");
                        ui.element.css('width', closest);
                        
                        //ui.element.resizable('option', 'minHeight', ui.element.find('#boxlabel').height());

                    },
                    stop: function(event, ui) {
                        goMason();
                        //$('#sortable li[id='+ui.element.attr("id")+']').data('w',ui.element.width());
                        //$('#sortable li[id='+ui.element.attr("id")+']').data('h',ui.element.height());
                    },
                    minWidth: getOneCellWidth() * settings.minWidth,
                    minHeight: getGridHeight() * settings.minHeightEm,
                    maxWidth: getGridMaxWidth(),
                    grid: [getOneCellWidth(),getGridHeight()],
                    handles: 'e,se,s'
                }).disableSelection();

                // highlight boxes
                $(this).mouseover(function(){
                    $("body").css("cursor","pointer");
                    $(this).css('background-color','#dddddd');
                });
                $(this).mouseout(function(){
                    $("body").css("cursor","auto");
                    $(this).css('background-color','#e9e9e9');
                });
            });


            transform_percent_px();


            //The container to respect the given settings
            var full_width = $container.width();
            var offsetwidth = 0;
            if (settings.offset){
                  offsetwidth = (getOneCellWidth()+full_width*0.0208333) * settings.offset;
                console.info(offsetwidth);
                // console.info(diffoffset);
                
            }
            var containerwidth = (getOneCellWidth()+full_width*0.0208333) * settings.columns;
            $container.css('width',containerwidth).css('left', offsetwidth);



// This only for this demo
// First align all blocks to grid
$(settings.sortable).children('li').each(function(){
$this = $(this);
var li_width = $this.width();
var closest = getClosest(px_widths, li_width);
$this.css('width', closest);

});



            $(settings.sortable).find('li').css('margin-right',full_width/100*2.08333);
            goMason();
            $container.css('visibility','visible');
            

        });
    };
})(jQuery);