<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output indent="no" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->
	
	<!-- Delete if it already exists to be readded -->
	<xsl:template match="/Parameters[@localeID='en-CA']/param[@id='264485']"/>
	<xsl:template match="/Parameters[@localeID='en-CA']">
		<xsl:copy>
			<xsl:apply-templates select="@*|node()"/>
			<param id="264485">
				<name>TORCH CENTERING HEIGHT</name>
				<short_name></short_name>
				<desc>The height at which the software will attempt to center the torch from the base of the groove</desc>
			</param>
		</xsl:copy>
	</xsl:template>

	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>