document.addEventListener("DOMContentLoaded", function() {
	
  //Remove unzip message
  $("#unzip_message").hide();
  $("#unzip_mask").show();
  
  // Lookup commonly used elements.
  var calculator      = $('#calculator');
  var inputs          = $('input.number', calculator);
  var triangleImage   = $('.drawing img', calculator);
  var errorsContainer = $('#errors');
  var triangle;
  
  // Calculate triangle on form submit.
  calculator.submit(function() {
    // Clear errors.
    errorsContainer.empty();
    
    triangle = new CosSinCalc.Triangle();
    
    // Set angle unit.
    triangle.angles.unit = $("input[name='angle_unit']:checked").val();
    
    // Collect variables.
    inputs.each(function() {
      var name = this.id.split('_');
      triangle[name[0]](name[1], this.value);
    });
    
    // Execute calculation.
    var result = triangle.calculate();
    
    if (result.isValid()) {
      // Update result tab.
      writeOutput();
      
      // Show results
	  $("#result").show();
      
    }
    else {
      // Write error messages in unordered list.
      var errorList = $(document.createElement('ul'));
      for (var i = 0, n = result.exceptions.length; i < n; i++) {
        errorList.append('<li>' + result.exceptions[i] + '</li>');
      }
      errorsContainer.text('Noget gik galt:').append(errorList);
      
      // Mark form fields with errors.
      inputs.each(function() {
        var name = this.id.split('_');
        if (result[name[0] + 's'][name[1]] == false) $(this).addClass('error');
      });
    }
    
    // Prevent default form submit action.
    return false;
  });
  
  function writeOutput() {
    // Write variables to result table.
    $('#result table.variables .variable').each(function() {
      var name = this.id.split('_');
      $(this).text(triangle[name[0]](name[1]));
    });
    
    $('#area_result').text(triangle.area());
    $('#circumference_result').text(triangle.circumference());
    
    $('#calculation_notice').toggle(!!triangle.alternative);
    
    // Render equations.
    var equations = triangle.formatEquations();
    $('#calculation_steps').html(equations);
    MathJax.Hub.Queue(['Typeset', MathJax.Hub, 'calculation_steps']);
    
    // Draw triangle.
    setTimeout(function() {
      var container = $('#drawing').empty();
      var drawing   = new CosSinCalc.Triangle.Drawing(triangle, 300, 50);
      drawing.draw(container[0]);
	  
	  //Scroll results into view
	  $("#result")[0].scrollIntoView();
    }, 0);
  }
  
  // Clear all text fields and remove errors on reset.
  $('#clear').click(function() {
    inputs.val('').removeClass('error');
    errorsContainer.empty();
  });
  
  // Link triangle image map to form fields.
  $('#initial_drawing .hover').mouseenter(function() {
    $($(this).attr('href')).focus();
    return false;
  });
  $('#initial_drawing .hover').click(function() {
    $($(this).attr('href')).focus();
    return false;
  });
  
  // Change triangle image overlay on form field focus/blur.
  inputs.mouseenter(function() {
	inputs.removeClass('focus');
    $(this).removeClass('error').addClass('focus').select();
	setDrawingHighlight(this.id);
  }).focus(function() {
	inputs.removeClass('focus');
    $(this).removeClass('error').addClass('focus').select();
	setDrawingHighlight(this.id);
  }).blur(function() {
    $(this).removeClass('focus');
    $("#initial_drawing .highlight")[0].style.opacity = 0;
  });
  
  function setDrawingHighlight(id){
	hlight = $("#initial_drawing .highlight")[0];
	hlight.style.opacity = 1;
	switch(id){
		case "angle_a":
			hlight.setAttribute("cx", 21);
			hlight.setAttribute("cy", 142);
			break;
		case "angle_b":
			hlight.setAttribute("cx", 223);
			hlight.setAttribute("cy", 22);
			break;
		case "angle_c":
			hlight.setAttribute("cx", 320);
			hlight.setAttribute("cy", 139);
			break;
		case "side_a":
			hlight.setAttribute("cx", 277);
			hlight.setAttribute("cy", 83);
			break;
		case "side_b":
			hlight.setAttribute("cx", 179);
			hlight.setAttribute("cy", 147);
			break;
		case "side_c":
			hlight.setAttribute("cx", 129);
			hlight.setAttribute("cy", 73);
			break;
			
	}
  }
  
  
  $('#increase_precision').click(function() {
    if (!triangle.decimals) $('#decrease_precision').removeClass('disabled');
    triangle.decimals++;
    writeOutput();
    return false;
  });
  
  $('#decrease_precision').click(function() {
    if (triangle.decimals) {
      triangle.decimals--;
      writeOutput();
      if (!triangle.decimals) $(this).addClass('disabled');
    }
    return false;
  });
  
  $('#show_alternative').click(function() {
    triangle = triangle.alternative;
    triangle.decimals = triangle.alternative.decimals;
    writeOutput();
    return false;
  });

});
