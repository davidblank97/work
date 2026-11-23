<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output indent="no" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->

	<xsl:template match="/Parameters[@localeID='en-CA']">
		<xsl:copy>
			<xsl:apply-templates select="@*|node()"/>
			<param id="198921">
				<name>THETA TOOL CENTRE POINT</name>
				<short_name></short_name>
				<desc>A weld setting that, when enabled, will adjust the axes so that the end of the torch will remain in the same location while theta moves.</desc>
			</param>
			<param id="198922">
				<name>TRAVEL SPEED COMPENSATED BY HEIGHT</name>
				<short_name></short_name>
				<desc>A weld setting that, when enabled, will adjust travel speed using height changes to produce a constant torch speed as the pipe diameter changes.</desc>
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