/**
*
* @fileoverview Libreria con funciones de utilidad
* @author Francisco Cordova
* @date 26/10/2012
* @version 1.0
*/

$(document).ready(function(){
    
    var Playlist = 'TUPLAYLIST';
    
    function busqueda(){
        var txtMarca = $('#txtMarca').val();
        var txtSOperativo = $('#txtSOperativo').val();
        var txtTema = $('#txtTema').val();
        var txtBuscar = $('#txtBuscar').val();
        if( txtBuscar == '¿Qué deseas buscar?' ){ txtBuscar = ''; }
        var strbuscar = txtMarca+' '+txtSOperativo+' '+txtTema+' '+txtBuscar;
        var limpia = $.trim(strbuscar);
        var yt_url='http://gdata.youtube.com/feeds/api/playlists/'+Playlist+'?v=2&alt=json';
        
        console.log(limpia)
        
        if( limpia=='' ){
            alert('No se ha ingresado un filtro o lo que deseas buscar.')
        }else{
            $.ajax({ 
                type: "GET", 
                url: yt_url, 
                dataType:"jsonp",
                beforeSend: function(){
                    $('#box_resultado .items, #box_resultado .msj_error').remove()
                },
                success: function(response){ 
                    $('.video_intro').hide(0);
                    
                    var arrayDatos = response.feed.entry;
                    var arrayBuscar = $.grep(arrayDatos, function(element){
                        return element.media$group.media$description.$t.toLowerCase().match(limpia);
                    });
                    
                    console.log(arrayBuscar.length)
                    
                    if(arrayBuscar != ''){
                        $.each(arrayBuscar, function(i,data){
                            var video_id = data.media$group.yt$videoid.$t; 
                            var video_titulo = data.title.$t; 
                            var video_contenido = data.media$group.media$description.$t.split('¿');
                            var video_thumbnail = data.media$group.media$thumbnail[2].url;
                            
                            $('#box_resultado').append('<div class="items">'+
                            '<div class="thumb"><a href="#" rel="'+video_id+'"><img src="'+video_thumbnail+'" alt=""></a></div>'+
                            '<div class="contenido">'+
                            '<h1><a href="#" rel="'+video_id+'">'+video_titulo+'</a></h1>'+
                            '<p>'+video_contenido[0]+'</p>'+
                            '</div>'+
                            '</div>');
                            
                        });
                        
                        $('#box_resultado .items a').bind('click', function(){
                            var id = $(this).attr('rel');
                            var url = 'http://gdata.youtube.com/feeds/api/videos?alt=json&q='+id+'&author=CanalMovistarPeru'
                            $.ajax({ 
                                type: "GET", 
                                url: url, 
                                dataType:"jsonp",
                                beforeSend: function(){
                                    //antes
                                },
                                success: function(response){ 
                                    var titulos = response.feed.entry[0].title.$t.split('-');
                                    var titulo = titulos[0];
                                    var subtitulo = titulos[1];
                                    var contenido = response.feed.entry[0].content.$t;
                                    var video = '<iframe id="ytplayer" type="text/html" width="640" height="360" src="https://www.youtube.com/embed/'+id+'?showinfo=0" frameborder="0" allowfullscreen></iframe>'
                                } 
                            });
                            return false;
                        })
                        
                    }else{
                        $('#box_resultado').append('<div class="msj_error">No se econtro coincidencias.</div>')
                    }
                    
                } 
            });
        }
    }
    
    $('#btnBuscar').bind('click', busqueda);
    $('#txtBuscar').bind('keypress', function(e){ if(e.which == 13) { busqueda(); } });

});







