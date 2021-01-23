const showOwner = (element) => {
  if (element.firstChild.innerText == 'Show') {
    element.firstChild.remove();
    element.children[0].classList.remove('hidden');
  }
}
