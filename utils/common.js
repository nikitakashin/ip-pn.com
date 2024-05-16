export const copyTextToClipboard = (text) => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text);
    return true;
  }

  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    document.execCommand("copy");
  } catch (err) {
    console.error(err);
    return false;
  }

  document.body.removeChild(textArea);
  return true;
};
