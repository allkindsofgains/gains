import logger from './logger.js';
import { discord } from '../config/env.js';
import axios from 'axios';

/* It sends a message to a Discord channel */
// https://gist.github.com/Birdie0/78ee79402a4301b1faf412ab5f1cdcf9
export default class Chad {
  static async notify(msg, object = null) {
    try {
      let params = null;

      if (object == null) {
        params = {
          username: 'Chad',
          content: msg,
        };
      } else {
        params = {
          username: 'Chad',
          content: msg,
          embeds: [
            {
              title: msg,
              description: object,
            },
          ],
        };
      }

      const res = await axios({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: JSON.stringify(params),
        url: discord.url,
      });

      if (res.status === 204) logger.info(`Chad sent ${msg}`);
    } catch (e) {
      logger.error(e);
    }
  }
}