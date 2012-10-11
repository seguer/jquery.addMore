/**
* Add More
* Allows for the creation of new elements based on a Mustache template, these
* elements can be reordered if jqueryui.sortable is present.
* @author		Seguer
* @version	2012.10.13
* @url 			https://github.com/seguer/jquery.addMore
* @see 			http://addyosmani.com/resources/essentialjsdesignpatterns/book/#jquerypluginpatterns
* @see			http://docs.jquery.com/Plugins/Authoring#Plugin_Methods
*/
;(function($, window, document, undefined)
{
	var self = this,
	sortable = false,
	defaults =
	{
		template: '',
		templateData: function(data){ return {}; },
		container: null,
		item: '*[data-addmore="item"]',
		more: '*[data-addmore="more"]',
		remove: '*[data-addmore="remove"]',
		focus: 'input',
		sortable:
		{
			axis: 'y',
			handle: '*[data-addmore="handle"]',
			items: '*[data-addmore="item"]'
		}
	},
	methods =
	{
		init: function(options)
		{
			//check this during init; maybe jQuery.ui.sortable was loaded after addMore
			sortable = (typeof jQuery.ui != 'undefined' && typeof jQuery.ui.sortable != 'undefined');
			
			return this.each(function()
			{
				var $this = $(this),
				data = $this.data('addMore');
				
				if (!data)
				{
					data = $.extend({}, defaults, options);
					$(this).data('addMore', data);
					_setup($this, data);
				}
			});
		},
		publicMethod: function()
		{
			//called by plugin('publicMethod');
		},
	},
	_setup = function($container, data)
	{
		data = $.extend({}, data, { container: $container });
		$(data.container).on('click', data.more, data, _handle.more);
		$(data.container).on('click', data.remove, data, _handle.remove);
		
		if (sortable)
		{
			$(data.container).sortable(data.sortable);
		}
	},
	_handle =
	{
		more: function(event)
		{
			event.preventDefault();
			var templateData = $.isFunction(event.data.templateData) ? event.data.templateData.call(event.data) : event.data.templateData,
			$more = $(Mustache.render(event.data.template, templateData)),
			lastItem = $(event.data.item, event.data.container).last();
		  
		  if (lastItem.length)
		  {
		  	lastItem.after($more);
			}
			else
			{
				$(event.currentTarget).before($more);
			}
		  $(event.data.focus, $more).focus();
		  $(event.data.container).sortable('refresh')
		},
		remove: function(event)
		{
			event.preventDefault();
			$(event.currentTarget).parents(event.data.item).remove();
			
			if (sortable)
			{
				event.data.container.sortable('refresh');
			}
		}
	};

	$.fn.addMore = function(method)
	{
		if ( methods[method] )
		{
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		}
		else if ( typeof method === 'object' || ! method )
		{
			return methods.init.apply( this, arguments );
		}
		else
		{
			$.error('Method ' +  method + ' does not exist on jQuery.addMore');
		}
	};
})(jQuery, window, document);
