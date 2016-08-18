import postcss from 'postcss';
import AddNamespace from './add-namespace';

export default postcss.plugin('postcss-add-namespace',
  (namespace, opts = {}) =>
    (css) =>
      new AddNamespace(css, namespace, opts)
);
