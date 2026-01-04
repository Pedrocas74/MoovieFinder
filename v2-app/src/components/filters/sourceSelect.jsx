import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

export default function SourceSelect({ value, onChange, label = "Source" }) {
  return (
    <>
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
            color: "var(--clr-text)",
          },
        }}
        size="small"
        fullWidth
      >
        <InputLabel id="source-select-label">{label}</InputLabel>

        <Select
          labelId="source-select-label"
          value={value}
          label={label}
          onChange={(e) => onChange(e.target.value)}
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
          <MenuItem value="trending">Trending</MenuItem>
          <MenuItem value="popular">Popular</MenuItem>
          <MenuItem value="upcoming">Upcoming</MenuItem>
        </Select>
      </FormControl>
    </>
  );
}
