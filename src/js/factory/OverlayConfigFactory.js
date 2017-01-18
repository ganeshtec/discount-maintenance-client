app.factory('OverlayConfigFactory', function(){
    return {
        getInstance : function(){
            return {
            	isOpen:false,
            	
            	isMaskable:false, 

                open: function(){
                    this.isOpen= true;
                },

                close: function(){
                   this.isOpen = false; 
                },

                mask: function(maskable){
                	this.isMaskable = maskable;
                }
            }
        }
    }               
});