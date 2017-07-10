HTMLWidgets.widget({
  name: 'transceiver',       // see also transmitter, receiver
  type: 'output',

  factory: function(el, width, height) {
    var ct_sel1 = new crosstalk.SelectionHandle();
    var ct_sel2 = new crosstalk.SelectionHandle();
    return {
      renderValue: function(x) {
        if(x.crosstalk_group) { 
          ct_sel1.setGroup(x.crosstalk_group);
          ct_sel2.setGroup(x.crosstalk_group2);
        } else return;
        el.innerHTML = x.innerHTML;
        var cf = function(e) {
          if(e.sender === ct_sel1) return;
          var val;
          if(Array.isArray(e.value)) {
            // the usual crosstalk selection array values
            if(x.lookup) {
              val = e.value.map(function(i) {return x.lookup[x.crosstalk_key.indexOf(i)];});
            } else val = e.value;
            if(! Array.isArray(val)) val = [val];
              if(Array.isArray(val[0])) val = [].concat.apply([], val); // flatten
          } else val = e.value;
          if(el.children && el.children.length > 0) el.children[0][x.value] = val;
          ct_sel2.set(val);
        };
        ct_sel1.on("change", cf);
        if(el.children && el.children.length > 0) {
          el.children[0].addEventListener("change", function() {
            var val = el.children[0][x.value];
            if(!Array.isArray(val)) val = [val];
            if(Array.isArray(val[0])) val = [].concat.apply([], val); // flatten
            ct_sel2.set(val);
          });
        }
        if(x.init) {
          var val;
          if(Array.isArray(x.init)) {
            if(x.lookup) val = x.init.map(function(i) {return x.lookup[x.crosstalk_key.indexOf(i)];});
            else val = x.init;
          } else {
            if(x.lookup) val = [x.lookup[x.crosstalk_key.indexOf(x.init)]];
            else val = [x.init];
          }
          cf({sender: null, value: val});
        }
      },
      resize: function(width, height) { }
    };
  }
});