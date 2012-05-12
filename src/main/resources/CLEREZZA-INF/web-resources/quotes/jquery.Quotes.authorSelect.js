(function ($, undefined) {
	
	var html = '<span style="display:none" id="creator_value" property="dc:creator" >foobar</span>'+
	'	  <span class="creator_pre_selected">'+
	'	  <select class="creator_select" onchange="">'+
	'		  <option>unknown</option>'+
	'		  <option>other</option>'+
	'	  </select>'+
	'	  <a href="#" onclick="selectOther()">Select Other</a>'+
	'	  </span>'+
	'	  <span class="creator_other">'+
	'		  <input type="text" class="creator_other_text"/>'+
	'	  <a href="#" onclick="selectPreselected()">X</a>'+
	'	  </span>'+
	 '</span>'


  // # Create author-select widget
  jQuery.widget('Quotes.authorSelect', {
	options: {
      vie: null,
      enableCollectionAdd: true
    },
	vie: null,
	_create: function () {
		console.log('create')
      this.vie = this.options.vie;
	},
	_init: function(){
		console.log('_init ')
		this.element.html(html)
		var element = this.element
		var widget = this
		var propertyName = this.vie.service('rdfa').getElementPredicate(element);
		element.attr('content', 'dr. fink')
		var select = element.find('.creator_select')
		//var value = this.element.find('.creator_value')
		select.change(function() {
			console.log('foo: '+widget.options.model)
			widget.options.modified($(this).val())
			//widget._trigger('changed', null, {
			/*element.trigger('midgardeditablechanged', null, {
				property: propertyName,
				instance: widget.options.model,
				element: element,
				entityElement: widget.element
			});*/
			alert('triggered for '+propertyName+' with '+element)
		})
	},
   enable: function () {
      alert('enabling...')
    },

    disable: function () {
      alert('disabling...')
    }
  });
})(jQuery);
