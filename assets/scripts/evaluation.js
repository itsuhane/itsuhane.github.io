Algebra = (function() {
  function vecScale(s, v) { return v.map(x => s*x); }
  function vecSquaredNorm(v) { return v.reduce((s, x) => s + x*x, 0); }
  function vecNorm(v) { return Math.sqrt(vecSquaredNorm(v)); }
  function vecNormalize(v) { return vecScale(1.0/vecNorm(v), v); }
  function vecAdd(v1, v2) { return v1.map((x, i) => x + v2[i]); }
  function vecSub(v1, v2) { return v1.map((x, i) => x - v2[i]); }
  function vecDot(v1, v2) { return v1.reduce((s, x, i) => s + x*v2[i], 0); }
  function vecLerp(l, v1, v2) { return v1.map((x, i) => x + l*(v2[i] - x)); }
  function vecStableNorm(v) {
    let s = Math.max(v.map(Math.abs));
    if (s>1.0e9) {
      let sv = vecScale(1.0/s, v);
      return s * vecNorm(sv);
    } else {
      return vecNorm(v);
    }
  }
  function vecStableNormalize(v) {
    let s = Math.max(v.map(Math.abs));
    if (s>1.0e9) {
      let sv = vecScale(1.0/s, v);
      return vecNormalize(sv);
    } else if (s>1.0e-9) {
      return vecNormalize(v)
    } else {
      return v;
    }
  }

  function quatConjugate(q) { return [ -q[0], -q[1], -q[2], q[3] ]; }
  function quatMult(q1, q2) {
    return [
        q1[0]*q2[3] + q1[1]*q2[2] - q1[2]*q2[1] + q1[3]*q2[0],
      -q1[0]*q2[2] + q1[1]*q2[3] + q1[2]*q2[0] + q1[3]*q2[1],
        q1[0]*q2[1] - q1[1]*q2[0] + q1[2]*q2[3] + q1[3]*q2[2],
      -q1[0]*q2[0] - q1[1]*q2[1] - q1[2]*q2[2] + q1[3]*q2[3]
    ];
  }
  function quatExpMap(w) {
    let halfangle = 0.5*vecNorm(w);
    let axis = vecStableNormalize(w);
    let imagine = vecScale(Math.sin(halfangle), axis);
    let real = Math.cos(halfangle);
    return [ imagine[0], imagine[1], imagine[2], real ];
  }
  function quatLogMap(q) {
    let saxis = [ q[0], q[1], q[2] ];
    let coshalfangle = q[3];
    let sinhalfangle = vecNorm(saxis);
    let angle = 2.0*Math.atan2(sinhalfangle, coshalfangle);
    return vecScale(angle, vecStableNormalize(saxis));
  }
  function quatToMatrix(q) {
    let x2 = q[0] + q[0];
    let y2 = q[1] + q[1];
    let z2 = q[2] + q[2];
    let w2 = q[3] + q[3];
    let yy2 = q[1] * y2;
    let xy2 = q[0] * y2;
    let xz2 = q[0] * z2;
    let yz2 = q[1] * z2;
    let zz2 = q[2] * z2;
    let wz2 = q[3] * z2;
    let wy2 = q[3] * y2;
    let wx2 = q[3] * x2;
    let xx2 = q[0] * x2;
    return [
      [1 - yy2 - zz2, xy2 + wz2, xz2 - wy2],
      [xy2 - wz2, 1 - xx2 - zz2, yz2 + wx2],
      [xz2 + wy2, yz2 - wx2, 1 - xx2 - yy2]
    ];
  }
  function quatFromMatrix(m) {
    if (m[0][0] + m[1][1] + m[2][2] > 0) {
      let t = 1 + m[0][0] + m[1][1] + m[2][2];
      let s = 0.5 / Math.sqrt(t);
      return [ (m[1][2]-m[2][1])*s, (m[2][0]-m[0][2])*s, (m[0][1]-m[1][0])*s, t*s ];
    } else if (m[0][0] > m[1][1] && m[0][0] > m[2][2]) {
      let t = 1 + m[0][0] - m[1][1] - m[2][2];
      let s = 0.5 / Math.sqrt(t);
      return [ t*s, (m[0][1]+m[1][0])*s, (m[2][0]+m[0][2])*s, (m[1][2]-m[2][1])*s ];
    } else if (m[1][1] > m[2][2]) {
      let t = 1 - m[0][0] + m[1][1] - m[2][2];
      let s = 0.5 / Math.sqrt(t);
      return [ (m[0][1]+m[1][0])*s, t*s, (m[1][2]+m[2][1])*s, (m[2][0]-m[0][2])*s ];
    } else {
      let t = 1 - m[0][0] - m[1][1] + m[2][2];
      let s = 0.5 / Math.sqrt(t);
      return [ (m[2][0]+m[0][2])*s, (m[1][2]+m[2][1])*s, t*s, (m[0][1]-m[1][0])*s ];
    }
  }
  function quatRotate(q, v) {
    return quatToMatrix(q).map( r => vecDot(r, v));
  }
  function quatSlerp(l, q1, q2) {
    let qj = q2;
    let d = vecDot(q1, qj);
    if (d < 0) {
      d = -d;
      qj = vecScale(-1, q2);
    }
    if (d>0.9995) {
      return vecNormalize(lerp(l, q1, q2));
    }
    let th1 = Math.acos(d);
    let th = th1*l;
    let sinth1 = Math.sin(th1);
    let sinth = Math.sin(th);
    let s2 = sinth/sinth1;
    let s1 = Math.cos(th) - d*s2;
    return vecNormalize(vecAdd(vecScale(s1, q1), vecScale(s2, q2)));
  }
  return {
    scale: vecScale,
    squaredNorm: vecSquaredNorm,
    norm: vecNorm,
    stableNorm: vecStableNorm,
    normalize: vecNormalize,
    stableNormalize: vecStableNormalize,
    add: vecAdd,
    sub: vecSub,
    dot: vecDot,
    lerp: vecLerp,
    Quaternion: {
      conjugate: quatConjugate,
      mult: quatMult,
      rotate: quatRotate,
      exp: quatExpMap,
      log: quatLogMap,
      toMatrix: quatToMatrix,
      fromMatrix: quatFromMatrix,
      slerp:quatSlerp
    }
  }
})();

Parser = (function() {
  function tum2array(text) {
    return text.split(' ');
  }
  function csv2array(text) {
    var re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
    var re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
    if (!re_valid.test(text)) return null;
    var a = [];
    text.replace(re_value,
      function(m0, m1, m2, m3) {
          if      (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));
          else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
          else if (m3 !== undefined) a.push(m3);
          return '';
      }
    );
    if (/,\s*$/.test(text)) a.push('');
    return a;
  };
  function array2trajectory(arr) {
    var num = arr.map(Number.parseFloat);
    if (num.length!==8) {
      console.log('Mal-formed line skipped.');
      return null;
    }
    return {
      t: num[0],
      q_ws: [ num[4], num[5], num[6], num[7] ],
      p_ws: [ num[1], num[2], num[3] ]
    };
  }
  function makeParser(format2array) {
    return function(text) {
      return text.split('\n').map(format2array).map(array2trajectory).filter(v => v!==null);
    }
  }
  return {
    tum: {
      name: 'TUM',
      parse: makeParser(tum2array)
    },
    csv: {
      name: 'CSV',
      parse: makeParser(csv2array)
    }
  };
})();

DatasetLoader = (function(xhr) {
  var progressbar = new Nanobar();
  progressbar.go(0);
  function createRequest(dataset, sequence, complete) {
    var url = ['/datasets', dataset, sequence, ''].join('/');
    var pseudo_remaining = 100;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onprogress = function(e) {
      var progress = 0;
      if (e.lengthComputable) {
        progress = 99 * e.loaded/e.total;
      } else {
        pseudo_remaining = pseudo_remaining * (0.93 + Math.random() * 0.04);
        progress = 99 - pseudo_remaining;
      }
      progressbar.go(Math.max(progress, 1.0));
    };
    xhr.onload = function(e) {
      if (xhr.readyState === 4 && xhr.status === 200) {
        progressbar.go(100);
        var json = JSON.parse(xhr.responseText);
        complete(json);
      } else {
        console.error(xhr.statusText);
      }
      progressbar.go(0);
    };
    xhr.onabort = function(e) {
      progressbar.go(0);
    };
    xhr.onerror = function(e) {
      console.error(xhr.statusText);
      progressbar.go(0);
    };
    progressbar.go(1);
    xhr.send(null);
    return xhr;
  }
  function beginRequest(dataset, sequence, complete) {
    cancelRequest();
    xhr = createRequest(dataset, sequence, complete);
  }
  function cancelRequest() {
    if (xhr) {
      xhr.abort();
      xhr = null;
    }
  }

  return {
    load: beginRequest,
    cancel: cancelRequest
  }
})();

UI = (function(
  datasets,
  dataset_combo,
  sequence_combo,
  reference_combo,
  format_combo,
  label_textbox,
  scale_toggle,
  trajectory_file,
  info_container,
  plot_container
) {
  function comboClearOptions(combo) {
    while (combo.length > 0) {
      combo.remove(0);
    }
  }

  function comboAppendOption(combo, value, text) {
    var option = document.createElement('option');
    option.value = value;
    option.text = text;
    combo.add(option);
  }

  function comboSelected(combo) {
    if (combo.options[combo.selectedIndex]) {
      let value = combo.options[combo.selectedIndex].value;
      return (value !== '---') ? value : null;
    } else {
      return null;
    }
  }

  function showInformation(text) {

  }

  function updateFormatCombo() {
    comboClearOptions(format_combo);
    comboAppendOption(format_combo, '---', '(select format)');
    format_combo.disabled = true;
    for (p in Parser) {
      comboAppendOption(format_combo, p, Parser[p].name);
      format_combo.disabled = false;
    }
    updateUI();
  }

  function updateDatasetCombo() {
    comboClearOptions(dataset_combo);
    comboAppendOption(dataset_combo, '---', '(select dataset)');
    dataset_combo.disabled = true;
    for (d in datasets) {
      comboAppendOption(dataset_combo, d, datasets[d].name);
      dataset_combo.disabled = false;
    }
    updateSequenceCombo();
  }

  function updateSequenceCombo() {
    comboClearOptions(sequence_combo);
    comboAppendOption(sequence_combo, '---', '(select sequence)');
    sequence_combo.disabled = true;
    let selected_dataset = comboSelected(dataset_combo);
    if (selected_dataset !== null) {
      let sequences = datasets[selected_dataset].sequences;
      for (s in sequences) {
        comboAppendOption(sequence_combo, s, sequences[s].name);
        sequence_combo.disabled = false;
      }
    }
    updateReferenceCombo();
  }

  var groundtruth;
  function updateReferenceCombo() {
    comboClearOptions(reference_combo);
    comboAppendOption(reference_combo, '---', '(select reference)');
    reference_combo.disabled = true;
    let selected_dataset = comboSelected(dataset_combo);
    let selected_sequence = comboSelected(sequence_combo);
    if (selected_sequence !== null) {
      DatasetLoader.load(selected_dataset, selected_sequence, function(sequence) {
        groundtruth = sequence;
        for (r in sequence.sensors) {
          comboAppendOption(reference_combo, r, sequence.sensors[r].name);
          reference_combo.disabled = false;
        }
        updateUI();
      });
    }
    updateUI();
  }

  function updateUI() {
    let selected_referece = comboSelected(reference_combo);
    let selected_format = comboSelected(format_combo);
    trajectory_file.disabled = (selected_referece === null) || (selected_format === null);
  }

  function updateEvaluation(e) {
    var files = e.target.files;
    if (files.length === 0) return;
    var f = files[0];
    var label = label_textbox.value ? label_textbox.value : f.name;
    var prescale = scale_toggle.checked;
    var reader = new FileReader();
    var selected_reference = comboSelected(reference_combo);
    var selected_format = comboSelected(format_combo);
    reader.onload = function(e) {
      var trajectory = Parser[selected_format].parse(e.target.result);
      var evaluation_result = evaluateTrajectory(label, prescale, selected_reference, trajectory, groundtruth);
    };
    reader.readAsText(f);
    trajectory_file.value = '';
  }

  updateFormatCombo();
  updateDatasetCombo();
  updateSequenceCombo();
  updateReferenceCombo();
  updateUI();

  dataset_combo.addEventListener('change', updateSequenceCombo, false);
  sequence_combo.addEventListener('change', updateReferenceCombo, false);
  reference_combo.addEventListener('change', updateUI, false);
  format_combo.addEventListener('change', updateUI, false);
  trajectory_file.addEventListener('change', updateEvaluation, false);
})(
  document.datasets,
  document.getElementById('dataset'),
  document.getElementById('sequence'),
  document.getElementById('reference'),
  document.getElementById('format'),
  document.getElementById('label'),
  document.getElementById('scale'),
  document.getElementById('trajectory'),
  document.getElementById('information'),
  document.getElementById('plot-container')
);

function evaluateTrajectory(label, prescale, reference, trajectory, groundtruth) {
  console.log(label);
  console.log(prescale);
  console.log(reference);
  console.log(trajectory);
  console.log(groundtruth);
}
