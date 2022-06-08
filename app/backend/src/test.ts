interface obj {
  a: number,
  b: number,
}

function asdf(params: Partial<obj>) {
  return params;
}

asdf({ a: 1, b: 6 });
