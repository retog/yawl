(function($, undefined) {

	var html = '<span><span style="display:none" property="dc:creator" >foobar</span>'
			+ '	  <span class="creator_pre_selected">'
			+ '	  <select class="creator_select" onchange="">'
			+ '		  <option>unknown</option>'
			+ '		  <option>other</option>'
			+ '	  </select>'
			+
			// ' <a href="#" onclick="selectOther()">Select Other</a>'+
			'	  </span>'
			+ '	  <span class="creator_other">'
			+ '		  <input type="text" class="creator_other_text"/>'
			+ '	  <a href="#" class="hideTextField" onclick="selectPreselected()">X</a>'
			+ '	  </span>' + '</span>';

	// # Create author-select widget
	$.widget('Quotes.authorSelect', {
		options : {
			vie : null,
			enableCollectionAdd : true
		},
		vie : null,
		_create : function() {
			console.log('create')
			this.vie = this.options.vie;
			this.editElem = $(html)
		},
		_init : function() {
			if (this.options.disabled) {
				this.disable();
			} else {
				this.enable();
			}
		},
		enable : function() {
			var element = this.element
			console.log('enabling with: ' + $(element).text())
			var value = element.text()
			this.editElem.insertAfter(element)
			//element.insertAfter(this.editElem)
			element.remove()
			element = this.editElem
			var widget = this
			var propertyName = this.vie.service('rdfa').getElementPredicate(
					element);
			element.attr('content', 'dr. fink')
			var select = element.find('.creator_select')
			var otherArea = element.find('.creator_other')
			var textField = element.find('.creator_other_text')
			textField.change(function() {
				console.log('txt: ' + widget.options.model)
				//widget.options.modified(textField.val())
			})
			otherArea.hide()
			var hideTextField = element.find('.hideTextField')
			hideTextField.click(function selectPreselected() {
				otherArea.hide(500)
				select.show(500)
				select.append('<option>' + textField.val() + '</option>')
				var value = textField.val();
				if (select.find('option:contains(' + value + ')').length == 0) {
					select.append('<option>' + value + '</option>')
				}
				select.val(value)
			})
			var enableTextField = function() {
				otherArea.show();
			}
			// var value = this.element.find('.creator_value')
			select.change(function() {
				console.log('foo: ' + widget.options.model)
				if ($(this).val() == 'other') {
					enableTextField()
					select.hide()
				} else {
					widget.options.modified($(this).val())
				}
			})
			// FIXME it shouldnt just contain but have the exact value
			if (select.find('option:contains(' + value + ')').length == 0) {
				select.append('<option>' + value + '</option>')
			}
			select.val(value)
			var textField = element.find('.creator_other_text')
			var vie = this.vie
			textField.vieAutocomplete({
				vie : vie,
				select : function(e, ui) {
					var uri = ui.item.key
					var name = ui.item.value
					console.log("uri: "+uri);
					widget.options.modified("<"+uri+">")
				}
			});
		},

		disable : function() {
			//alert('re-adding: '+this.element+' before '+this.editElem.size())
			var value = this.editElem.find('.creator_select').val()
			this.element.insertBefore(this.editElem)
			this.editElem.remove()
			this.element.html(value)
			console.log("set html to: "+value)
			//alert('things reset')
			
		}
	});
})(jQuery);
