import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setConcurrency(8);
Config.setPixelFormat('yuv420p');
Config.setCodec('h264');
Config.setCrf(14);
Config.setEntryPoint('./src/index.ts');
Config.setChromiumIgnoreCertificateErrors(true);
Config.overrideWebpackConfig((current) => current);
