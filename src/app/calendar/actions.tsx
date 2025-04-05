'use server'

import { createEvent } from 'ics'

export async function generateICS(title: String, description: String, location: any, start: string, duration: string ) {
    const event = {
        title: title || 'My Event',
        description: description || '',
        location: location || '',
        start: start ? JSON.parse(start) : [2025, 4, 10, 10, 0],
        duration: duration ? JSON.parse(duration) : { hours: 1, minutes: 0 },
      }
    
      return await createEvent();
}
