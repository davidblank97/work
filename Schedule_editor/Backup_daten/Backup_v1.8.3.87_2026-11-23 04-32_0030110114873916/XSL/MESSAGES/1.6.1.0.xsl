<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->

	<xsl:template match="/language[@fileType='DEV']">
		<xsl:copy>
			<xsl:apply-templates select="@*|node()"/>
			<str id="40">
				<text>No MFC detected at address %1.</text>
				<desc>%1 = address of MFC (Mass Flow Controller) not detected</desc>
			</str>
			<str id="41">
				<text>No MFM detected at address %1.</text>
				<desc>%1 = address of MFM (Mass Flow Meter) not detected</desc>
			</str>
		</xsl:copy>
  	</xsl:template>  

	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>