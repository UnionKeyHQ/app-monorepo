package so.unionkey.app.wallet;

import org.bouncycastle.bcpg.ArmoredInputStream;
import org.bouncycastle.openpgp.PGPPublicKey;
import org.bouncycastle.openpgp.PGPPublicKeyRingCollection;
import org.bouncycastle.openpgp.PGPSignature;
import org.bouncycastle.openpgp.PGPSignatureGenerator;
import org.bouncycastle.openpgp.PGPSignatureList;
import org.bouncycastle.openpgp.jcajce.JcaPGPObjectFactory;
import org.bouncycastle.openpgp.operator.jcajce.JcaKeyFingerprintCalculator;
import org.bouncycastle.openpgp.operator.jcajce.JcaPGPContentVerifierBuilderProvider;
import org.bouncycastle.util.Strings;
import org.bouncycastle.openpgp.PGPUtil;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.security.Provider;
import java.security.Security;
import java.security.SignatureException;

import org.bouncycastle.jce.provider.BouncyCastleProvider;

public class Verification {
    private static final void setupBouncyCastle() {
        final Provider provider = Security.getProvider(BouncyCastleProvider.PROVIDER_NAME);
        if (provider == null) {
            // Web3j will set up the provider lazily when it's first used.
            return;
        }
        if (provider.getClass().equals(BouncyCastleProvider.class)) {
            // BC with same package name, shouldn't happen in real life.
            return;
        }
        // Android registers its own BC provider. As it might be outdated and might not include
        // all needed ciphers, we substitute it with a known BC bundled in the app.
        // Android's BC has its package rewritten to "com.android.org.bouncycastle" and because
        // of that it's possible to have another BC implementation loaded in VM.
        Security.removeProvider(BouncyCastleProvider.PROVIDER_NAME);
        Security.insertProviderAt(new BouncyCastleProvider(), 1);
    }

    private static final String PUBLIC_KEY = "-----BEGIN PGP PUBLIC KEY BLOCK-----\n" +
            "\n" +
            "mQINBGpy2wABEADZ8XoMGTQ8X01l6yGZpDNgskhQ9irnSMMZV0eiYEdtfZz0K30/\n" +
            "A3OAcEgZ8JvcSXa7U84B2rHAYR5KtQ1qT2UQuDcVffbMaHtKb0i3qxQ7m20mK5bn\n" +
            "0eenhsp6clJ7GrcF7HFzkx3Kun9/54I6IUDgETmcKcknPF/ZGD4T/BdmpO0FnsV8\n" +
            "Lq9+KPGLbW6WqZ1HZLzq3PY0e/B73TLV2EYgazRdZgTWZ6l2JQywcQMFWkV8pBnv\n" +
            "xk/vzk4HU2vkyGqmXABPayZbLutdIUhlpZmz21xPs2WObtd2N3xLX5eMt3xPaj6F\n" +
            "ZicK1+0HAkP23xO7sNrgtCsiYJzHYMO9OD5a/x1VynmXYDmVm9/YvpAjRcQ2prpG\n" +
            "QFxitqJdS5XUYaKIBdEHPHPptcbQt4kv4DK0N2DKr1EMgsSPhjP4Sr20vtihEVVJ\n" +
            "L0KQUFoohFEcdovGhS+S4Xx5JbLVbZbf2wHhyqvVe+iZEbeoVEL3zzI64xkLVXCp\n" +
            "JUb5KOqBi9iy0h230VC01nqFuIJQghaw2ZxTfK+hSvEsZzaX7Tw6YZQo6tLAyBmM\n" +
            "ZBuixBnyqoehb4iZGgj8Wr3H1ra2lT9NLk9f/gCIAJD6o78yK9NN/rLlmcOxNtZx\n" +
            "6zF4KIirYgFGt7c6hrhbZf7ZLKBgHPK48lE2UguPFkDwJ2Rs9h+A9bZ0/wARAQAB\n" +
            "tDBVbmlvbktleSBEZXNrdG9wIFJlbGVhc2UgNiA8cmVsZWFzZUB1bmlvbmtleS5p\n" +
            "bz6JAnMEEwEIAF0WIQSCcMQu4V0UBl1Y4Ldjr4MEsU0/fwUCanLbABsUgAAAAAAE\n" +
            "AA5tYW51MiwyLjUrMS4xMiwyLDECGwMFCQPCZwAFCwkIBwICIgIGFQoJCAsCBBYC\n" +
            "AwECHgcCF4AACgkQY6+DBLFNP3+Gnw//YskHqkPMC+hOxFTiZAaSYgLLHacyErhJ\n" +
            "/6IT43kDqY4dHOFJT2ukXd6+Ju7iPyJjoEDxpC6ID5y+/ifDbbrzQ/S7z9//F46Q\n" +
            "eGdSFoOWtV11HdKTA5SDZJjafw1XiHMzrVFseThtr/acIQ4dwxNTb9F7pXSxwocF\n" +
            "EJz0wjbT+ZruWq9qD/4KqQCeGRDcf29RLLJrnvv2Xewkv4zonmUOdXJAxSgh1lwr\n" +
            "RYGBZRKqd1Tk/vy/PJHWgpcYnNcsMOfRe7+ER6RpTxRgWs0Cr4vojBZCjqYhbAUF\n" +
            "1gsDglCs83nLbKHVUdRccu/5fUQi+Tigjhu8/r/vb45quA0YkQ5OvS+E7/uwq4lt\n" +
            "sypGRz2ViOilvEno5/hLHsqsC4dDP9xLmgS6am8Qca8VqFS5V7BFp4kRoKExTEjx\n" +
            "AIwySaR+xJukZyY8FEP8q0e+QpegZJXxMGuFFwsJXFaKvqhiZP4c220RBlcXe5Ky\n" +
            "Xj5ZEDNafzX4yxdIAtHwOCw9riwV9Tq2jAzF8H4UagVyuTJmeqRGcABcP7t/zLB7\n" +
            "zmv6cN3docYI7RrOov2oIXR4px4s2HGqqmzbyRKvixXV3tpH3st4p38ztFusdLHq\n" +
            "SnOdL6GaYoaB3UWIno7bQpO+jcfttQ+oDIpxJspoyNfX1NTTftFgVPfMOzxezLLC\n" +
            "A+XmaXwuiPg=\n" +
            "=/LH+\n" +
            "-----END PGP PUBLIC KEY BLOCK-----";
    private static int readInputLine(ByteArrayOutputStream bOut, InputStream fIn)
            throws IOException
    {
        bOut.reset();

        int lookAhead = -1;
        int ch;

        while ((ch = fIn.read()) >= 0)
        {
            bOut.write(ch);
            if (ch == '\r' || ch == '\n')
            {
                lookAhead = readPassedEOL(bOut, ch, fIn);
                break;
            }
        }

        return lookAhead;
    }

    private static int readInputLine(ByteArrayOutputStream bOut, int lookAhead, InputStream fIn)
            throws IOException
    {
        bOut.reset();

        int ch = lookAhead;

        do
        {
            bOut.write(ch);
            if (ch == '\r' || ch == '\n')
            {
                lookAhead = readPassedEOL(bOut, ch, fIn);
                break;
            }
        }
        while ((ch = fIn.read()) >= 0);

        if (ch < 0)
        {
            lookAhead = -1;
        }

        return lookAhead;
    }

    private static int readPassedEOL(ByteArrayOutputStream bOut, int lastCh, InputStream fIn)
            throws IOException
    {
        int lookAhead = fIn.read();

        if (lastCh == '\r' && lookAhead == '\n')
        {
            bOut.write(lookAhead);
            lookAhead = fIn.read();
        }

        return lookAhead;
    }

    /*
     * verify a clear text signed file
     */
    private static boolean verifyFile(
            InputStream        in,
            InputStream        keyIn,
            String             resultName
    )
            throws Exception
    {
        ArmoredInputStream    aIn = new ArmoredInputStream(in);
        OutputStream          out = new BufferedOutputStream(new FileOutputStream(resultName));



        //
        // write out signed section using the local line separator.
        // note: trailing white space needs to be removed from the end of
        // each line RFC 4880 Section 7.1
        //
        ByteArrayOutputStream lineOut = new ByteArrayOutputStream();
        int                   lookAhead = readInputLine(lineOut, aIn);
        byte[]                lineSep = getLineSeparator();

        if (lookAhead != -1 && aIn.isClearText())
        {
            byte[] line = lineOut.toByteArray();
            out.write(line, 0, getLengthWithoutSeparatorOrTrailingWhitespace(line));
            out.write(lineSep);

            while (lookAhead != -1 && aIn.isClearText())
            {
                lookAhead = readInputLine(lineOut, lookAhead, aIn);

                line = lineOut.toByteArray();
                out.write(line, 0, getLengthWithoutSeparatorOrTrailingWhitespace(line));
                out.write(lineSep);
            }
        }
        else
        {
            // a single line file
            if (lookAhead != -1)
            {
                byte[] line = lineOut.toByteArray();
                out.write(line, 0, getLengthWithoutSeparatorOrTrailingWhitespace(line));
                out.write(lineSep);
            }
        }

        out.close();

        PGPPublicKeyRingCollection pgpRings = new PGPPublicKeyRingCollection(keyIn, new JcaKeyFingerprintCalculator());

        JcaPGPObjectFactory           pgpFact = new JcaPGPObjectFactory(aIn);
        PGPSignatureList           p3 = (PGPSignatureList)pgpFact.nextObject();
        PGPSignature               sig = p3.get(0);
        PGPPublicKey publicKey = pgpRings.getPublicKey(sig.getKeyID());
        setupBouncyCastle();
        sig.init(new JcaPGPContentVerifierBuilderProvider().setProvider("BC"), publicKey);

        //
        // read the input, making sure we ignore the last newline.
        //

        InputStream sigIn = new BufferedInputStream(new FileInputStream(resultName));

        lookAhead = readInputLine(lineOut, sigIn);

        processLine(sig, lineOut.toByteArray());

        if (lookAhead != -1)
        {
            do
            {
                lookAhead = readInputLine(lineOut, lookAhead, sigIn);

                sig.update((byte)'\r');
                sig.update((byte)'\n');

                processLine(sig, lineOut.toByteArray());
            }
            while (lookAhead != -1);
        }

        sigIn.close();

        boolean isVerified = sig.verify();
        return isVerified;
    }

    private static byte[] getLineSeparator()
    {
        String nl = Strings.lineSeparator();
        byte[] nlBytes = new byte[nl.length()];

        for (int i = 0; i != nlBytes.length; i++)
        {
            nlBytes[i] = (byte)nl.charAt(i);
        }

        return nlBytes;
    }

    private static void processLine(PGPSignature sig, byte[] line)
            throws SignatureException, IOException
    {
        int length = getLengthWithoutWhiteSpace(line);
        if (length > 0)
        {
            sig.update(line, 0, length);
        }
    }

    private static void processLine(OutputStream aOut, PGPSignatureGenerator sGen, byte[] line)
            throws SignatureException, IOException
    {
        // note: trailing white space needs to be removed from the end of
        // each line for signature calculation RFC 4880 Section 7.1
        int length = getLengthWithoutWhiteSpace(line);
        if (length > 0)
        {
            sGen.update(line, 0, length);
        }

        aOut.write(line, 0, line.length);
    }

    private static int getLengthWithoutSeparatorOrTrailingWhitespace(byte[] line)
    {
        int    end = line.length - 1;

        while (end >= 0 && isWhiteSpace(line[end]))
        {
            end--;
        }

        return end + 1;
    }

    private static boolean isLineEnding(byte b)
    {
        return b == '\r' || b == '\n';
    }

    private static int getLengthWithoutWhiteSpace(byte[] line)
    {
        int    end = line.length - 1;

        while (end >= 0 && isWhiteSpace(line[end]))
        {
            end--;
        }

        return end + 1;
    }

    private static boolean isWhiteSpace(byte b)
    {
        return isLineEnding(b) || b == '\t' || b == ' ';
    }

    public static String extractedSha256FromVerifyAscFile(String ascFileContent, String cacheFilePath) throws Exception {
        InputStream        keyIn = PGPUtil.getDecoderStream(new ByteArrayInputStream(PUBLIC_KEY.getBytes()));
        InputStream in = new ByteArrayInputStream(ascFileContent.getBytes());
        boolean isVerified = verifyFile(in, keyIn, cacheFilePath);
        if (!isVerified) {
            return "";
        }
        ArmoredInputStream ascFileContentIn = new ArmoredInputStream(new ByteArrayInputStream(ascFileContent.getBytes()));
        ByteArrayOutputStream bOut = new ByteArrayOutputStream();
        int ch;

        while ((ch = ascFileContentIn.read()) >= 0 && ascFileContentIn.isClearText())
        {
            bOut.write((byte)ch);
        }
        ascFileContentIn.close();
        String extractedSha256 = bOut.toString().split(" ")[0];
        return extractedSha256;
    }
}
