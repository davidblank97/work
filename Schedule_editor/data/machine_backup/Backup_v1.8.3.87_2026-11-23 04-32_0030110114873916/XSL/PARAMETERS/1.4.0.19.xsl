<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output indent="yes" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->
	<xsl:template match="/Parameters">
		<xsl:copy>
			<xsl:apply-templates select="@*|node()"/>
			<param id="198923">
				<name>TRAVEL SPEED COMPENSATED BY WIDTH</name>
				<short_name>COMPENSATED BY WIDTH</short_name>
				<desc>A weld setting that, when enabled, will adjust travel speed using the oscillator width to produce a constant weld area.</desc>
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