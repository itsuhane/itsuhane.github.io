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
      return vecNormalize(vecLerp(l, q1, q2));
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
    if (num.length !== 8) {
      console.warn('Malformed line skipped.');
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
      return text.split('\n').map(format2array).map(array2trajectory).filter(v => v !== null).sort((a, b) => a.t - b.t);
    }
  }
  return {
    tum: {
      name: 'TUM',
      parse: makeParser(tum2array),
      description: 'Trajectory File Format:\n<t[s]> <p.x[m]> <p.y[m]> <p.z[m]> <q.x> <q.y> <q.z> <q.w>'
    },
    csv: {
      name: 'CSV',
      parse: makeParser(csv2array),
      description: 'Trajectory File Format:\n<t[s]>,<p.x[m]>,<p.y[m]>,<p.z[m]>,<q.x>,<q.y>,<q.z>,<q.w>'
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
    var pre = document.createElement('pre');
    pre.className = 'highlight';
    pre.textContent = text;
    while (info_container.firstChild) {
      info_container.removeChild(info_container.firstChild);
    }
    info_container.appendChild(pre, info_container.firstChild);
  }

  function clearPlots() {
    while (plot_container.firstChild) {
      plot_container.removeChild(plot_container.firstChild);
    }
  }

  function appendTrajectoryPlot(trajectories) {
    var plot_area = document.createElement('div');
    plot_area.className = 'plot';
    plot_container.appendChild(plot_area);

    let plot_options = {
      showlegend: true,
      legend: { x: 0, y: 1 },
      margin: { l: 0, r: 0, b:0, t:0 },
      scene: { aspectmode: 'data' },
      autosize: true
    }

    let plot_data = trajectories.map(t => {
      return {
        type: 'scatter3d',
        mode: 'lines',
        name: t.name,
        opacity: 1,
        x: t.poses.map(v => v.p_ws[0]),
        y: t.poses.map(v => v.p_ws[1]),
        z: t.poses.map(v => v.p_ws[2])
      };
    });

    Plotly.plot(plot_area, plot_data, plot_options, { responsive: true });
  }

  function appendErrorPlot(errors) {
    var plot_area = document.createElement('div');
    plot_area.className = 'plot plot-flat';
    plot_container.appendChild(plot_area);

    let plot_options = {
      showlegend: true,
      legend: {
        x: 0,
        y: 1,
        yanchor: 'bottom',
        orientation: 'h'
      },
      autosize: true,
      margin: { l: 0, r: 0, b:0, t:32 },
      scene: { aspectmode: 'data' }
    };

    Plotly.plot(plot_area, [
      {
        name: 'x',
        x: errors.map(v => v.t),
        y: errors.map(v => v.e[0]),
        opacity: 1,
        line: { color: '#ff595e' }
      },
      {
        name: 'y',
        x: errors.map(v => v.t),
        y: errors.map(v => v.e[1]),
        opacity: 1,
        line: { color: '#8ac926' }
      },
      {
        name: 'z',
        x: errors.map(v => v.t),
        y: errors.map(v => v.e[2]),
        opacity: 1,
        line: { color: '#1982c4' }
      }
    ], plot_options, { responsive:true });
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
      clearPlots();
      evaluation_result.segment.map((s, i) => {
        if (s.valid) {
          appendTrajectoryPlot([
            {
              name: 'GT Segment ' + i,
              poses: s.accumulated.groundtruth
            },
            {
              name: evaluation_result.general.label,
              poses: s.accumulated.trajectory
            }
          ]);
          appendErrorPlot(s.accumulated.errors);
        }
      });
      var information = [
        'Label: ' + evaluation_result.general.label,
        'Sequence: ' + evaluation_result.general.dataset + '/' + evaluation_result.general.sequence,
        'Scaled: ' + (prescale ? 'Yes' : 'No')
      ];
      evaluation_result.segment.map((s, i) => {
        if (s.valid) {
          information = information.concat([
            'Segment ' + i + ":",
            '  rmse:   ' + Number.parseFloat(s.rmse.rmse).toFixed(5),
            '  min:    ' + Number.parseFloat(s.rmse.min).toFixed(5),
            '  max:    ' + Number.parseFloat(s.rmse.max).toFixed(5),
            '  mean:   ' + Number.parseFloat(s.rmse.mean).toFixed(5),
            '  median: ' + Number.parseFloat(s.rmse.median).toFixed(5)
          ]);
        } else {
          information = information.concat([
            'Segment ' + i + ': (result unavailable)'
          ]);
        }
      });
      showInformation(information.join('\n'))
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
  format_combo.addEventListener('change', function() {
    updateUI();
    let selected_format = comboSelected(format_combo);
    if (selected_format !== null) {
      showInformation(Parser[selected_format].description);
    }
  }, false);
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
  document.getElementById('info-container'),
  document.getElementById('plot-container')
);

function computeSegmentLength(segment) {
  return segment.map((v,i) => (i === 0) ? 0 : Algebra.norm(Algebra.sub(v.p_wb, segment[i-1].p_wb))).reduce((u, v) => u + v, 0);
}

function sampleSegment(segment, t) {
  function binarySearch(sd, pred) {
    let lo = -1, hi = sd.length;
    while (1 + lo < hi) {
      const mi = lo + ((hi - lo) >> 1);
      if (pred(sd[mi])) {
        hi = mi;
      } else {
        lo = mi;
      }
    }
    return hi;
  }

  let i = binarySearch(segment, x => t <= x.t);
  if(t === segment[i]) {
    return segment[i];
  } else {
    let e0 = segment[i-1];
    let e1 = segment[i];
    let l = (t - e0.t) / (e1.t - e0.t);
    return {
      t: t,
      q_wb: Algebra.Quaternion.slerp(l, e0.q_wb, e1.q_wb),
      p_wb: Algebra.lerp(l, e0.p_wb, e1.p_wb)
    };
  }

}

function body2sensor(segment, sensor_transform) {
  return segment.map(v => {
    return {
      t: v.t,
      q_ws: Algebra.Quaternion.mult(v.q_wb, sensor_transform.q_bs),
      p_ws: Algebra.add(v.p_wb, Algebra.Quaternion.rotate(v.q_wb, sensor_transform.p_bs))
    };
  });
}

// Q*data+T = S*groundtruth
function umeyama(data, groundtruth) {
  let ps1 = data.map(u => u.p_ws);
  let ps2 = groundtruth.map(u => u.p_ws);
  let cog1 = Algebra.scale(1.0 / ps1.length, ps1.reduce((p, x) => Algebra.add(p, x), [0, 0, 0]));
  let cog2 = Algebra.scale(1.0 / ps2.length, ps2.reduce((p, x) => Algebra.add(p, x), [0, 0, 0]));
  let ps1_centered = ps1.map(x => Algebra.sub(x, cog1));
  let ps2_centered = ps2.map(x => Algebra.sub(x, cog2));
  let var1 = Math.sqrt(ps1_centered.reduce((v, x) => v + Algebra.squaredNorm(x), 0));
  let var2 = Math.sqrt(ps2_centered.reduce((v, x) => v + Algebra.squaredNorm(x), 0));
  let S = var1 / var2;
  let ps2_scaled = ps2_centered.map(x => Algebra.scale(S, x));
  let cov = ps1_centered.reduce((s, x, i) => {
    let y = ps2_scaled[i];
    return [
      Algebra.add(s[0], Algebra.scale(x[0], y)),
      Algebra.add(s[1], Algebra.scale(x[1], y)),
      Algebra.add(s[2], Algebra.scale(x[2], y))
    ];
  }, [[0,0,0],[0,0,0],[0,0,0]]).map(c => Algebra.scale(1.0 / ps1.length, c));
  let svd = Jmat.svd(cov);
  let E = [[1,0,0],[0,1,0],[0,0,1]];
  if (Jmat.determinant(svd.v.mul(svd.u.transpose())).re < 0.0) {
    E[2][2] = -1;
  }
  let matR = svd.v.mul(Matrix(E)).mul(svd.u.transpose());
  let R = [
    matR.e[0].map(c => c.re),
    matR.e[1].map(c => c.re),
    matR.e[2].map(c => c.re)
  ];
  let result = { S: S, Q: Algebra.Quaternion.fromMatrix(R)};
  result.T = Algebra.sub(Algebra.scale(S, cog2), R.map(r => Algebra.dot(r, cog1)));
  return result;
}

function transformTrajectory(scale, alignment, trajectory) {
  return trajectory.map(v => {
    return {
      t: v.t,
      q_ws: Algebra.Quaternion.mult(alignment.Q, v.q_ws),
      p_ws: Algebra.scale(scale ? 1 / alignment.S : 1, Algebra.add(Algebra.Quaternion.rotate(alignment.Q, v.p_ws), alignment.T))
    };
  });
}

function computeStats(ape) {
  function process(err) {
    return {
      min: Math.min.apply(Math, err),
      max: Math.max.apply(Math, err),
      median: err[err.length >> 1],
      mean: err.reduce((s, v) => s + v, 0) / err.length,
      rmse: Math.sqrt(err.reduce((s, v) => s + v*v, 0) / err.length)
    }
  }
  let n_err = ape.map(v => Algebra.norm(v)).sort((a, b) => a - b);
  let result = process(n_err);

  return result;
}

function evaluateSegment(prescale, reference_sensor, trajectory, segment) {
  let t_begin = segment[0].t;
  let t_end = segment[segment.length - 1].t;
  let subtrajectory = trajectory.filter(v => (v.t >= t_begin && v.t <= t_end));
  let st_begin = subtrajectory.length > 0 ? subtrajectory[0].t : t_end;
  let st_end = subtrajectory.length > 0 ? subtrajectory[subtrajectory.length - 1].t : t_end;
  let completeness = (st_end - st_begin) / (t_end - t_begin);
  var result = {
    valid: false,
    completeness: completeness
  };
  if (completeness >= 0.5) {
    let sensor_segment = body2sensor(subtrajectory.map(v => sampleSegment(segment, v.t)), reference_sensor);
    let rmse_alignment = umeyama(subtrajectory, sensor_segment);
    let accum_alignment = {
      S: rmse_alignment.S,
      Q: rmse_alignment.Q,
      T: Algebra.sub(Algebra.scale(prescale ? rmse_alignment.S : 1, sensor_segment[0].p_ws), Algebra.Quaternion.rotate(rmse_alignment.Q, subtrajectory[0].p_ws))
    }
    let rmse_trajectory = transformTrajectory(prescale, rmse_alignment, subtrajectory);
    let accum_trajectory = transformTrajectory(prescale, accum_alignment, subtrajectory);
    let rmse_ape = sensor_segment.map((v, i) => Algebra.sub(v.p_ws, rmse_trajectory[i].p_ws));
    let accum_ape = sensor_segment.map((v, i) => Algebra.sub(v.p_ws, accum_trajectory[i].p_ws));
    let rmse_stat = computeStats(rmse_ape);
    let accum_stat = computeStats(accum_ape);
    accum_stat.errors = sensor_segment.map((v, i) => { return { t: v.t, e: Algebra.sub(v.p_ws, accum_trajectory[i].p_ws) }; });
    accum_stat.groundtruth = sensor_segment;
    accum_stat.trajectory = accum_trajectory;
    result.valid = true;
    result.scale = rmse_alignment.S;
    result.rmse = rmse_stat;
    result.accumulated = accum_stat;
  }
  return result;
}

function evaluateTrajectory(label, prescale, reference, trajectory, groundtruth) {
  let segment_dur = groundtruth.segments.map(s => s[s.length - 1].t - s[0].t);
  let segment_len = groundtruth.segments.map(computeSegmentLength);
  var general = {
    label: label,
    scaled: prescale,
    dataset: groundtruth.dataset,
    sequence: groundtruth.name,
    segment_num: groundtruth.segments.length,
    segment_dur: segment_dur,
    segment_dur_sum: segment_dur.reduce((u, v) => u + v, 0),
    segment_len: segment_len,
    segment_len_sum: segment_len.reduce((u, v) => u + v, 0)
  };

  var segment_eval_result = groundtruth.segments.map(s => evaluateSegment(prescale, groundtruth.sensors[reference], trajectory, s));

  return {
    general: general,
    segment: segment_eval_result
  };
}
