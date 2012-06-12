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
			+ '	  <a href="#" class="hideTextField">X</a>'
			+ '	  </span>' + '</span>';

	var getSubjects = function() {
		var subjects = {}
		if (localStorage.subjects) {
			subjects = JSON.parse(localStorage.subjects)
		}
		return subjects;
	}
	
	// # Create subject-select widget
	$.widget('Quotes.subjectSelect', {
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
			var getEntityForLabel = function(label) {
				var tagEntity = vie.entities.addOrUpdate({
					'@subject': '<'+getSubjects()[label]+'>',
					'rdfs:label': label,
					'@type': 'skos:Concept'
				});
				return tagEntity
			}
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
			var populateSelect = function() {
				select.find('option').remove()
				var subjects = getSubjects();
				for (label in subjects) {
					select.append('<option>'+label+'</option>')
				}
				select.append('<option>other</option>')
			}
			populateSelect()
			var otherArea = element.find('.creator_other')
			var textField = element.find('.creator_other_text')
			textField.change(function() {
				console.log('txt: ' + widget.options.model)
				//widget.options.modified(textField.val())
			})
			otherArea.hide()
			var hideTextField = element.find('.hideTextField')
			hideTextField.click(function selectPreselected() {
			    populateSelect()
				otherArea.hide(500)
				select.show(500)
				//select.append('<option>' + textField.val() + '</option>')
				var value = textField.val();
				/*if (select.find('option:contains(' + value + ')').length == 0) {
					select.append('<option>' + value + '</option>')
				}*/	
				select.val(value)
			})
			var enableTextField = function() {
				otherArea.show();
			}
			// var value = this.element.find('.creator_value')
			select.change(function() {
				console.log('select changed: ' + widget.options.model)
				if ($(this).val() == 'other') {
					enableTextField()
					select.hide()
				} else {
					widget.options.modified(getEntityForLabel($(this).val()))
				}
			})
			// FIXME it shouldnt just contain but have the exact value
			if (select.find('option:contains(' + value + ')').length == 0) {
				var newOption = $('<option>' + value + '</option>')
				newOption.insertBefore(select.find('option')[0]);
				//TODO create entity
			}
			select.val(value)
			var textField = element.find('.creator_other_text')
			var vie = this.vie
			textField.vieAutocomplete({
				vie : vie,
				select : function(e, ui) {
					var uri = ui.item.key
					var name = ui.item.value
					console.log("uri: "+uri, ui);
					var tagEntity = vie.entities.addOrUpdate({
						'@subject': '<'+uri+'>',
						'rdfs:label': name,
						'@type': 'skos:Concept'
					});
					console.log('te: ', tagEntity)
					tagEntity.forceChanged(true);
					//tagEntity.save()
					widget.options.modified(tagEntity);
					var subjects = getSubjects();
					subjects[name] = uri;
					localStorage.subjects = JSON.stringify(subjects);
				}
			});
		},

		disable : function() {
			//alert('re-adding: '+this.element+' before '+this.editElem.size())
			var value = this.editElem.find('.creator_select').val()
			console.log("this: "+this)
			console.log(".creator_select: "+this.editElem.find('.creator_select'));
			console.log("value: "+value)
			this.element.insertBefore(this.editElem)
			this.editElem.remove()
			console.log("html: "+this.element.html())
			this.element.html(value)
			this.element.attr('href', getSubjects()[value])
			console.log("set html to: "+value)
			console.log("html: "+this.element.html())
			console.log('#subject_select', $('#subject_select').html())
			//alert('things reset')
			
		}
	});
})(jQuery);
