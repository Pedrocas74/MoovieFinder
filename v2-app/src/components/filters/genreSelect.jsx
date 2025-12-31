import { useEffect, useState } from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import { getGenres } from "../../services/tmdb";

export default function GenreSelect({
  value = [],
  onChange,
  label = "Genres",
}) {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const genreList = await getGenres();
        setGenres(genreList);
      } catch (err) {
        console.error("Failed to load genres:", err);
      }
    })();
  }, []);

  const handleChange = (event) => {
    const selectedIds = event.target.value;
    onChange(selectedIds);
  };

  const renderValue = (selected) => {
    if (selected.length === 0) return "Select genres";
    const selectedNames = genres
      .filter((genre) => selected.includes(genre.id))
      .map((genre) => genre.name);
    return selectedNames.join(", ");
  };

  return (
    <FormControl
      sx={{
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "var(--clr-text)",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "var(--clr-primary)",
        },
        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
          {
            borderColor: "var(--clr-primary)",
          },

        "& .MuiSelect-select": {
          color: "var(--clr-text)",
        },

        "& .MuiInputLabel-root": {
          color: "var(--clr-text)",
        },
        "& .MuiInputLabel-root.Mui-focused": {
          color: "var(--clr-primary)",
        },

        "& .MuiSvgIcon-root": {
          color: "var(--clr-text)", // dropdown arrow
        },
      }}
      size="small"
      fullWidth
    >
      <InputLabel id="genre-select-label">{label}</InputLabel>
      <Select
        labelId="genre-select-label"
        multiple
        value={value}
        label={label}
        onChange={handleChange}
        renderValue={renderValue}
        MenuProps={{
    PaperProps: {
      sx: {
        backgroundColor: "var(--clr-bg)",
        color: "var(--clr-text)",
        border: "1px solid var(--clr-border)",
      },
    },
  }}

      >
        {genres.map((genre) => (
          <MenuItem key={genre.id} value={genre.id}>
            <Checkbox checked={value.includes(genre.id)} />
            <ListItemText primary={genre.name} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
