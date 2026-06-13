import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Paper,
  Grid,
  Link,
  useTheme,
  alpha
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Circle
} from '@mui/icons-material';
import { LocalizationProvider, DateCalendar } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, addMonths, subMonths, isSameDay, isWithinInterval, isBefore, isAfter, startOfDay } from 'date-fns';

const AirbnbDatePicker = ({ availableDates = [] }) => {
  const theme = useTheme();
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 11, 1)); // Dec 2025
  const [selectedRange, setSelectedRange] = useState({
    start: null,
    end: null
  });
  const [hoveredDate, setHoveredDate] = useState(null);

  // Example available dates - in real app, this would come from props
  const defaultAvailableDates = [
    { start: new Date(2025, 11, 10), end: new Date(2025, 11, 20) },
    { start: new Date(2025, 11, 25), end: new Date(2026, 0, 10) }
  ];

  const availableRanges = availableDates.length > 0 ? availableDates : defaultAvailableDates;

  const isDateAvailable = (date) => {
    return availableRanges.some(range => 
      isWithinInterval(date, { start: range.start, end: range.end })
    );
  };

  const isDateSelected = (date) => {
    if (!selectedRange.start) return false;
    if (selectedRange.end) {
      return isWithinInterval(date, { 
        start: selectedRange.start, 
        end: selectedRange.end 
      });
    }
    return isSameDay(date, selectedRange.start);
  };

  const isStartDate = (date) => {
    return selectedRange.start && isSameDay(date, selectedRange.start);
  };

  const isEndDate = (date) => {
    return selectedRange.end && isSameDay(date, selectedRange.end);
  };

  const isInSelectionRange = (date) => {
    if (!selectedRange.start || !hoveredDate || selectedRange.end) return false;
    
    const start = selectedRange.start;
    const end = hoveredDate;
    
    return isWithinInterval(date, {
      start: start < end ? start : end,
      end: start < end ? end : start
    });
  };

  const handleDateClick = (date) => {
    if (!isDateAvailable(date)) return;

    if (!selectedRange.start || (selectedRange.start && selectedRange.end)) {
      // Start new selection
      setSelectedRange({ start: date, end: null });
    } else {
      // Complete selection
      if (isBefore(date, selectedRange.start)) {
        setSelectedRange({ start: date, end: selectedRange.start });
      } else {
        setSelectedRange({ ...selectedRange, end: date });
      }
    }
  };

  const handleDateHover = (date) => {
    if (selectedRange.start && !selectedRange.end) {
      setHoveredDate(date);
    }
  };

  const handleClearDates = () => {
    setSelectedRange({ start: null, end: null });
    setHoveredDate(null);
  };

  const navigateMonths = (direction) => {
    setCurrentMonth(current => 
      direction === 'next' ? addMonths(current, 1) : subMonths(current, 1)
    );
  };

  const CustomDay = (props) => {
    const { day, outsideCurrentMonth, ...other } = props;
    const date = day;
    const available = isDateAvailable(date);
    const selected = isDateSelected(date);
    const isStart = isStartDate(date);
    const isEnd = isEndDate(date);
    const inSelectionRange = isInSelectionRange(date);
    const isToday = isSameDay(date, new Date());

    return (
      <Box
        {...other}
        sx={{
          position: 'relative',
          height: 40,
          width: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: available ? 'pointer' : 'not-allowed',
          opacity: outsideCurrentMonth ? 0.3 : 1,
          '&:hover': {
            backgroundColor: available ? alpha(theme.palette.text.primary, 0.1) : 'transparent',
            borderRadius: '50%'
          },
          ...(inSelectionRange && {
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
          }),
          ...(isStart && !isEnd && inSelectionRange && {
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0
          }),
          ...(isEnd && !isStart && inSelectionRange && {
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0
          }),
          ...(inSelectionRange && !isStart && !isEnd && {
            borderRadius: 0
          })
        }}
        onClick={() => handleDateClick(date)}
        onMouseEnter={() => handleDateHover(date)}
      >
        <Box
          sx={{
            height: 36,
            width: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            position: 'relative',
            zIndex: 1,
            ...(selected && {
              backgroundColor: theme.palette.text.primary,
              color: theme.palette.background.paper,
              fontWeight: 'bold'
            }),
            ...(isToday && !selected && {
              border: `2px solid ${theme.palette.text.primary}`
            }),
            ...(!available && {
              color: theme.palette.text.disabled,
              textDecoration: 'line-through'
            })
          }}
        >
          {format(date, 'd')}
        </Box>
        
        {/* Selection range indicator */}
        {inSelectionRange && (isStart || isEnd) && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: isStart ? '50%' : 0,
              right: isEnd ? '50%' : 0,
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              zIndex: 0
            }}
          />
        )}
      </Box>
    );
  };

  const formatDateRange = () => {
    if (!selectedRange.start) return 'Select dates';
    if (!selectedRange.end) return `${format(selectedRange.start, 'MMM d, yyyy')} – Select end date`;
    return `${format(selectedRange.start, 'MMM d, yyyy')} – ${format(selectedRange.end, 'MMM d, yyyy')}`;
  };

  const getNightsCount = () => {
    if (!selectedRange.start || !selectedRange.end) return 0;
    const timeDiff = selectedRange.end.getTime() - selectedRange.start.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Paper elevation={0} sx={{ p: 3, maxWidth: 700, border: `1px solid ${theme.palette.divider}`, borderRadius: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" fontWeight="600" gutterBottom>
            {getNightsCount()} night{getNightsCount() !== 1 ? 's' : ''} in El Mesala Shark
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {formatDateRange()}
          </Typography>
        </Box>

        {/* Calendar Navigation */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <IconButton onClick={() => navigateMonths('prev')}>
            <ChevronLeft />
          </IconButton>
          
          <Box sx={{ display: 'flex', gap: 6 }}>
            <Typography variant="h6" fontWeight="600">
              {format(currentMonth, 'MMMM yyyy')}
            </Typography>
            <Typography variant="h6" fontWeight="600">
              {format(addMonths(currentMonth, 1), 'MMMM yyyy')}
            </Typography>
          </Box>

          <IconButton onClick={() => navigateMonths('next')}>
            <ChevronRight />
          </IconButton>
        </Box>

        {/* Calendar Grid */}
        <Grid container spacing={4}>
          {/* First Month */}
          <Grid item xs={12} sm={6}>
            <DateCalendar
              value={null}
              onChange={() => {}}
              onMonthChange={() => {}}
              referenceDate={currentMonth}
              reduceAnimations
              slots={{
                day: CustomDay
              }}
              slotProps={{
                day: {
                  sx: {
                    border: 'none',
                    background: 'none',
                    margin: 0
                  }
                }
              }}
              sx={{
                width: '100%',
                '& .MuiDayCalendar-header': {
                  justifyContent: 'space-around',
                  '& .MuiDayCalendar-weekDayLabel': {
                    height: 40,
                    width: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 500,
                    color: theme.palette.text.secondary
                  }
                },
                '& .MuiDayCalendar-monthContainer': {
                  '& .MuiDayCalendar-weekContainer': {
                    justifyContent: 'space-around'
                  }
                }
              }}
            />
          </Grid>

          {/* Second Month */}
          <Grid item xs={12} sm={6}>
            <DateCalendar
              value={null}
              onChange={() => {}}
              onMonthChange={() => {}}
              referenceDate={addMonths(currentMonth, 1)}
              reduceAnimations
              slots={{
                day: CustomDay
              }}
              slotProps={{
                day: {
                  sx: {
                    border: 'none',
                    background: 'none',
                    margin: 0
                  }
                }
              }}
              sx={{
                width: '100%',
                '& .MuiDayCalendar-header': {
                  justifyContent: 'space-around',
                  '& .MuiDayCalendar-weekDayLabel': {
                    height: 40,
                    width: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 500,
                    color: theme.palette.text.secondary
                  }
                },
                '& .MuiDayCalendar-monthContainer': {
                  '& .MuiDayCalendar-weekContainer': {
                    justifyContent: 'space-around'
                  }
                }
              }}
            />
          </Grid>
        </Grid>

        {/* Footer */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Link
            component="button"
            variant="body2"
            onClick={handleClearDates}
            sx={{ 
              color: 'text.secondary',
              textDecoration: 'none',
              '&:hover': {
                color: 'text.primary',
                textDecoration: 'underline'
              }
            }}
          >
            Clear dates
          </Link>
        </Box>
      </Paper>
    </LocalizationProvider>
  );
};

export default AirbnbDatePicker;