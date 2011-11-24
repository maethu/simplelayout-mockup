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



$(function(){
    // Possible grid widths in %, taken from deco.gs
    var px_widths = [];
    var GRID_WIDTHS = [
        4,
        10.25,
        16.5,
        22.75,
        29,
        35.25,
        41.5,
        47.75,
        54,
        60.25,
        66.5,
        72.75,
        79,
        85.25,
        91.5,
        97.75];
    

    function transform_percent_px(){
        var maxwidth = $('#pageHolder').width();
        for(i in GRID_WIDTHS){
            px_widths.push(maxwidth/100*GRID_WIDTHS[i]);
        }
    }



    function goMason(){
        $('#pageHolder').masonry({
            columnWidth: 1,
            itemSelector: '.masonry'
        });
    }

    function getOneCellWidth(){
        // As defined in Deco.gs, 1 cells == 4%
        return $('#pageHolder').width() * 0.04;
    }
    function getGridHeight(){
        // 1em in px
        return $('#pageHolder').css('font-size').slice(0,2); //cut off px
    }

    function getGridMaxWidth(){
        // max width in deco.gs 97.75%, use div#pageholder as reference
        return $('#pageHolder').width() * 0.9775;
    }

    function getPositionInParent(element) {
        return element.index();
    }

    $(function(){
        $('#sortable').sortable({
            placeholder: {
                element: function(currentItem) {
                    return $("<li class='masonry placeholder' style='height: " + (currentItem.height()-2) + "px; width: " + (currentItem.width()-2) +"px;'></li>")[0];
                },
                update: function(container, p) {
                    return;
                }
            },
            tolerance: function(currentItem){
                return 'pointer';
            },
            items: 'li',
            opacity: 0.6,
            // containment: 'body',
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
        
        $('#sortable').children('li').each(function(){    
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

                    // Just a helper
                    ui.element.find('#boxlabel span.cells').html(" ("+(px_widths.indexOf(closest)+1)+")");
                },
                stop: function(event, ui) {
                    goMason();
                    //$('#sortable li[id='+ui.element.attr("id")+']').data('w',ui.element.width());
                    //$('#sortable li[id='+ui.element.attr("id")+']').data('h',ui.element.height());
                },                
                minWidth: getOneCellWidth()*2,
                minHeight: getGridHeight()*2,
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
    });
    
    $(window).load(function () {
        goMason();
        $('#pageHolder').css('visibility','visible');
        transform_percent_px();
    });  
  
  
});

