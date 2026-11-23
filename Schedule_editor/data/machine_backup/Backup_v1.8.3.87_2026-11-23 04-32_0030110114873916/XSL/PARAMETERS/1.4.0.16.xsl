<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output indent="no" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->
	<!-- Delete if it already exists to be readded -->
	<xsl:template match="/Parameters[@localeID='en-CA']/param[@id='269844']"/>
	<xsl:template match="/Parameters[@localeID='en-CA']/param[@id='269848']"/>
	<xsl:template match="/Parameters[@localeID='en-CA']">
		<xsl:copy>
			<xsl:apply-templates select="@*|node()"/>
			<param id="269844">
				<name>CALIBRATED ZERO POSITION</name>
				<short_name>ZERO</short_name>
				<desc>The voltage reading that represents the zero position of an axis' encoder.</desc>
			</param>
			<param id="269848">
				<name>OLD CALIBRATED ZERO POSITION</name>
				<short_name>ZERO</short_name>
				<desc>The voltage reading that represents the old zero position of an axis' encoder.</desc>
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