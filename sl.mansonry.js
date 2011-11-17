$(function(){

    function goMason(){
        $('#pageHolder').masonry({
            columnWidth: 1,
            itemSelector: '.masonry'
        });
    }

    
    $(function(){
        $('#sortable').sortable({
            placeholder: {
                element: function(currentItem) {
                    return $("<li class='masonry' style='margin: 1px; height: " + (currentItem.height()-4) + "px; width: " + (currentItem.width()-4) +"px; vertical-align: middle; text-align: center; outline: none; border: 1px dashed black; background-color: #97dd52;'></li>")[0];
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
                // serialize('sortable','serialList');
            },
            change: function() {
                // serialize('sortable','serialList');          
            },
            sort: function(){
                goMason();
            }
        }).disableSelection();
        
        $('#sortable').children('li').each(function(){    
            $(this).resizable({
                resize: function(event, ui) {
                    goMason();            
                    ui.element.children('#boxlabel').html(ui.element.children('#boxlabel').attr("name") + " (" + ui.element.width() + "x" + ui.element.height() + ")");
                },
                stop: function(event, ui) {
                    //$('#sortable li[id='+ui.element.attr("id")+']').data('w',ui.element.width());
                    //$('#sortable li[id='+ui.element.attr("id")+']').data('h',ui.element.height());
                },                
                minWidth: 8,
                minHeight: 8,
                maxWidth: 500,
                grid: [1,1],
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
    });  
  
  
});

