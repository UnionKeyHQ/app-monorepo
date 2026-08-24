package so.unionkey.app.wallet;

import android.content.Context;
import android.net.Uri;

import androidx.core.content.FileProvider;

import java.io.File;

public class UnionKeyFileProvider extends FileProvider {

   public static Uri getUriForFile(Context context, File file) {
       return getUriForFile(context, context.getPackageName() + ".unionkeyfile", file);
   }
}
